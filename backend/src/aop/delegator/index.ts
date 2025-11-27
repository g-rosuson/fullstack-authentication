import { MongoClientManager } from 'aop/db/mongo/client';
import { DbContext } from 'aop/db/mongo/context';
import { InternalException } from 'aop/exceptions';
import { logger } from 'aop/logging';

import config from 'config';

import { ErrorMessage } from 'shared/enums/error-messages';

import type { TargetError, Task, ToolMap, ToolResultMap, ToolType } from './types';

import toolRegistry from './tools';
import { EventEmitter } from 'events';
import { retryWithFixedInterval } from 'utils';

/**
 * Delegator provides a singleton entrypoint for routing job executions to domain-specific tools.
 *
 * The delegator manages the lifecycle of job execution, from registration through completion.
 * It can operate in both HTTP request contexts and background workers (e.g., cron jobs).
 * Tools are registered by domain (e.g., "scraper", "email") and resolved dynamically via
 * discriminated union types based on the tool's type property.
 *
 * The delegator maintains two job queues:
 * - pendingJobs: Tasks scheduled for future execution
 * - runningJobs: Tasks currently being executed
 *
 * An event bus is provided for emitting job execution events that can be subscribed to externally.
 */
export class Delegator {
    private static instance: Delegator | null = null;
    public pendingJobs = new Map<string, Task>();
    public runningJobs = new Map<string, Task>();
    public eventBus: EventEmitter;

    private constructor() {
        this.delegate = this.delegate.bind(this);
        this.register = this.register.bind(this);
        this.eventBus = new EventEmitter();
    }

    /**
     * Returns the singleton delegator instance.
     * Creates a new instance if one does not exist.
     *
     * @returns The Delegator singleton instance
     */
    static getInstance() {
        if (!Delegator.instance) {
            Delegator.instance = new Delegator();
        }

        return Delegator.instance;
    }

    /**
     * Registers a task to be executed later on schedule.
     * The task is stored in the pendingJobs queue until it is explicitly delegated.
     *
     * @param task The task to register with its jobId, name, and tools configuration
     */
    register(task: Task) {
        this.pendingJobs.set(task.jobId, task);
    }

    /**
     * Retrieves a pending task by job ID and delegates it for execution.
     * The task is removed from the pendingJobs queue before delegation.
     *
     * @param jobId The unique identifier of the scheduled task to execute
     * @throws {InternalException} If the scheduled task cannot be found in pendingJobs
     */
    delegateScheduledTask(jobId: string) {
        const scheduledTask = this.pendingJobs.get(jobId);

        if (!scheduledTask) {
            throw new InternalException(ErrorMessage.DELEGATOR_COULD_NOT_FIND_SCHEDULED_TASK);
        }

        this.delegate(scheduledTask);

        this.pendingJobs.delete(jobId);
    }

    /**
     * Executes a tool against all its configured targets and collects results and errors.
     *
     * For each target in the tool's configuration, this method:
     * - Executes the appropriate tool handler from the registry
     * - Collects successful results and errors separately
     * - Emits job-target-event for each target execution
     *
     * Tool execution errors are caught gracefully by the tool handlers and returned in the
     * errors array rather than being thrown. This allows partial success scenarios where
     * some targets succeed while others fail.
     *
     * @param tool The tool to execute, typed as ToolMap[T] for type safety
     * @returns An object containing arrays of results and errors from all target executions
     *          (never throws - all errors are collected in the errors array)
     */
    private async executeTool<T extends ToolType>(tool: ToolMap[T]) {
        const errors: TargetError[] = [];
        const results: ToolResultMap[T][] = [];

        // Type assertion: tool.type is a literal that matches T, but TS can't infer this relationship
        const toolType = tool.type as T;

        for (const config of tool.targets) {
            const result = await toolRegistry[toolType].execute({ tool, config });

            if (result.error) {
                errors.push(result.error);
            }

            if (result.output) {
                results.push(result);
            }

            // Emit event for each target execution to allow external monitoring
            this.eventBus.emit('job-target-event', {
                targetId: config.id,
                error: result.error,
                result: result.output,
            });
        }

        return {
            results,
            errors,
        };
    }

    /**
     * Delegates execution of a task by executing all its tools sequentially.
     *
     * This method:
     * - Adds the task to the runningJobs queue
     * - Executes each tool in the task's tools array (errors are collected, not thrown)
     * - Updates each tool with its execution results and errors
     * - Persists the final state to the database with retry logic for transient failures
     * - Emits 'job-persistence-failed' event if persistence fails after retries
     * - Removes the task from runningJobs when complete (even on error)
     *
     * Error handling strategy:
     * - Tool execution errors: Caught gracefully by tools and collected in errors arrays
     * - System errors (task not found): Re-thrown immediately for error middleware
     * - Persistence errors: Retried with fixed intervals, then event emitted if all retries fail
     * - Results are preserved in the event payload for manual retry if needed
     *
     * @param task The task containing jobId, name, and tools to execute
     * @throws {InternalException} If the task cannot be found in memory after being set
     * @throws Error If database persistence fails after all retry attempts
     */
    async delegate(task: Task) {
        try {
            this.runningJobs.set(task.jobId, task);

            const tmpTask = this.runningJobs.get(task.jobId);

            if (!tmpTask) {
                throw new InternalException(ErrorMessage.DELEGATOR_TASK_NOT_FOUND_IN_MEMORY);
            }

            // Execute each tool sequentially and update results
            for (let toolIndex = 0; toolIndex < tmpTask.tools.length; toolIndex++) {
                const toolConfig = tmpTask.tools[toolIndex];

                const { results, errors } = await this.executeTool(toolConfig);

                // Type assertion is safe: toolConfig.type is a discriminated union literal ('scraper' | 'email'),
                // which guarantees executeTool runs the correct tool at runtime. The assertion tells TS what we know to be true.
                (tmpTask.tools[toolIndex].results as ToolResultMap[typeof toolConfig.type][]) = results;
                tmpTask.tools[toolIndex].errors = errors;
            }

            // Persist results with retry logic for transient database failures
            // If persistence fails after retries, emit event with results for manual retry
            await this.persistResult(tmpTask);
        } catch (error) {
            // Handles system errors and persistence errors:
            // - System errors (task not found): Re-thrown immediately for error middleware
            // - Persistence errors: Already retried and event emitted in persistResult,
            //   then re-thrown here for error middleware handling
            // Note: Tool execution errors are caught gracefully and collected in errors arrays,
            // so they never reach this catch block
            throw error;
        } finally {
            // Always clean up runningJobs, regardless of success or failure
            this.runningJobs.delete(task.jobId);
        }
    }

    /**
     * Persists job results to the database with retry logic for transient failures.
     *
     * Uses retry logic to handle transient database issues (network timeouts, connection drops).
     * If all retries fail, emits a 'job-persistence-failed' event containing the task with results,
     * allowing external systems to handle manual retry or alternative persistence strategies.
     *
     * @param task The task with execution results to persist
     * @throws Error If persistence fails after all retry attempts (event is emitted before throwing)
     */
    private async persistResult(task: Task) {
        try {
            const updateJobPayload = {
                id: task.jobId,
                tools: task.tools,
                updatedAt: new Date(),
            };

            await retryWithFixedInterval(
                async () => {
                    const dbContext = await this.dbContext();
                    await dbContext.repository.jobs.update(updateJobPayload);
                },
                {
                    maxAttempts: config.maxDbRetries!,
                    delayMs: config.dbRetryDelayMs!,
                    operationName: `persisting job results for jobId: ${task.jobId}`,
                }
            );

            logger.info(`Successfully persisted job results for jobId: ${task.jobId}`);
        } catch (error) {
            // All retry attempts failed - emit event with results for manual retry
            const persistenceError = error as Error;

            logger.error(`Failed to persist job results after retries for jobId: ${task.jobId}`, {
                error: persistenceError,
            });

            // Note: This allows the client to manually retry to persist the results in worst case scenario
            this.eventBus.emit('job-persistence-failed', {
                task,
                error: {
                    message: persistenceError.message,
                    originalError: persistenceError,
                },
                timestamp: Date.now(),
            });

            // Re-throw to allow error middleware to handle the failure
            throw persistenceError;
        }
    }

    /**
     * Creates a new database context for repository operations.
     *
     * This method leverages the MongoClientManager singleton to establish a database connection.
     * Each call creates a fresh context, ensuring background executions have their own scoped
     * database access and transaction capabilities.
     *
     * @returns A DbContext instance with database connection and transaction support
     */
    private async dbContext() {
        const manager = MongoClientManager.getInstance();
        const db = await manager.connect();

        const transaction = {
            startSession: () => manager.startSession(),
        };

        return new DbContext(db, transaction);
    }
}
