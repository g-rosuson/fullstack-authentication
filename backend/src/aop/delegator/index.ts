import { MongoClientManager } from 'aop/db/mongo/client';
import { DbContext } from 'aop/db/mongo/context';
import { InternalException } from 'aop/exceptions';
import { logger } from 'aop/logging';

import config from 'config';

import { ErrorMessage } from 'shared/enums/error-messages';

import type { Job, TargetResult, ToolMap, ToolType } from './types';

import toolRegistry from './tools';
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
 * - pendingJobs: Jobs scheduled for future execution
 * - runningJobs: Jobs currently being executed
 *
 * @todo Add an id to each data chunk that is streamed for resumability
 */
export class Delegator {
    private static instance: Delegator | null = null;
    public pendingJobs = new Map<string, Job>();
    public runningJobs = new Map<string, Job>();

    /**
     * Private constructor to enforce singleton pattern.
     * Binds instance methods to ensure correct `this` context.
     */
    private constructor() {
        this.delegate = this.delegate.bind(this);
        this.register = this.register.bind(this);
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
     * Executes a tool and maps its targets with their execution results.
     *
     * Creates a shallow copy of the tool's targets and provides a callback function
     * that updates each target with its results as they complete. The callback is
     * invoked by the tool's execute function for each target that finishes processing.
     *
     * @template T - The tool type (must extend ToolType)
     * @param jobId - The unique identifier of the job containing this tool
     * @param tool - The tool to execute with its targets
     * @returns A promise that resolves to an array of targets with their results populated
     * @throws {InternalException} If a target result references a target that doesn't exist
     *
     * @todo Stream per target and return results with result and error
     * @todo To avoid emitting events in each tool, emit here
     * @todo Use the job ID for event emission
     */
    private async targetsWithResults<T extends ToolType>(jobId: string, tool: ToolMap[T]) {
        // Create a shallow copy of targets to avoid mutating the original tool's targets
        // This allows us to update results without affecting the source tool configuration
        const mappedTargets = [...tool.targets];

        // Callback function invoked by the tool's execute function when each target completes
        // This allows us to update targets with their results as they finish processing
        const onTargetFinish = (targetResult: TargetResult) => {
            // Find the target in our mapped copy that corresponds to the completed result
            const targetToUpdate = mappedTargets.find(target => target.id === targetResult.targetId);

            // Ensure the target exists - this should never happen if tool execution is correct
            if (!targetToUpdate) {
                throw new InternalException('Target not found');
            }

            // Update the target with its execution results
            targetToUpdate.results = targetResult.results;
        };

        // Execute the tool with the callback, allowing it to update targets as they complete
        // The tool will call onTargetFinish for each target that finishes processing
        await toolRegistry[tool.type as T].execute({
            tool,
            onTargetFinish,
        });

        // Return the targets with their results populated
        return mappedTargets;
    }

    /**
     * Executes a job by running all its tools sequentially and persisting the results.
     *
     * This is the main execution method that orchestrates the complete job lifecycle:
     * 1. Creates a shallow copy of the job to avoid mutating the original
     * 2. Executes each tool sequentially, updating targets with their results
     * 3. Persists the final job state to the database with retry logic
     * 4. Cleans up the job from runningJobs regardless of success or failure
     *
     * Error handling:
     * - System errors (e.g., target not found): Re-thrown immediately for error middleware
     * - Persistence errors: Retried with exponential backoff, then re-thrown if all retries fail
     * - Tool execution errors: Caught gracefully by tools and collected in error arrays,
     *   so they never reach this catch block
     *
     * @param job - The job to execute with its tools and targets
     * @throws Error If a system error occurs or persistence fails after all retry attempts
     */
    async delegate(job: Job) {
        try {
            // Create a shallow copy of the job to avoid mutating the original job object
            // This ensures that if the job is stored elsewhere, it won't be modified during execution
            const tmpJob = { ...job };

            // Execute each tool sequentially, updating targets with their results
            // Tools are processed in order, and each tool must complete before the next begins
            for (let toolIndex = 0; toolIndex < tmpJob.tools.length; toolIndex++) {
                const tool = tmpJob.tools[toolIndex];

                // Execute the tool and get back targets with their results populated
                const mappedToolTargets = await this.targetsWithResults(job.jobId, tool);

                // Update the tool's targets with the execution results
                tool.targets = mappedToolTargets;
            }

            // Persist the job results to the database with retry logic for transient failures
            await this.persistResult(tmpJob);
        } catch (error) {
            // Re-throw any errors (system errors or persistence failures) to be handled by error middleware
            // Tool execution errors are caught gracefully by tools and collected in error arrays,
            // so they never reach this catch block
            throw error;
        } finally {
            // Always clean up the job from runningJobs, regardless of success or failure
            // This ensures the job queue doesn't accumulate completed or failed jobs
            this.runningJobs.delete(job.jobId);
        }
    }

    /**
     * Registers a job to be executed later on schedule.
     *
     * The job is stored in the pendingJobs queue until it is explicitly delegated
     * via `delegateScheduledJob()` or `delegate()`.
     *
     * @param job - The job to register with its jobId, name, and tools configuration
     */
    register(job: Job) {
        this.pendingJobs.set(job.jobId, job);
    }

    /**
     * Retrieves a pending job by job ID and delegates it for execution.
     *
     * The job is removed from the pendingJobs queue before delegation begins.
     * This method is typically called by schedulers (e.g., cron jobs) to execute
     * jobs that were previously registered via `register()`.
     *
     * @param jobId - The unique identifier of the scheduled job to execute
     * @throws {InternalException} If the scheduled job cannot be found in pendingJobs
     */
    delegateScheduledJob(jobId: string) {
        const scheduledJob = this.pendingJobs.get(jobId);

        if (!scheduledJob) {
            throw new InternalException(ErrorMessage.DELEGATOR_COULD_NOT_FIND_SCHEDULED_JOB);
        }

        this.delegate(scheduledJob);

        this.pendingJobs.delete(jobId);
    }

    /**
     * Persists job results to the database with retry logic for transient failures.
     *
     * Uses retry logic with fixed intervals to handle transient database issues
     * (network timeouts, connection drops). The retry configuration is read from
     * the application config (maxDbRetries and dbRetryDelayMs).
     *
     * If all retry attempts fail, the error is logged and re-thrown to allow
     * error middleware to handle the failure appropriately.
     *
     * @param job - The job with execution results to persist
     * @throws Error If persistence fails after all retry attempts
     *
     * @todo Stream to client for manual retry in worst-case scenario, how is this done?
     * @todo Implement event bus to emit 'job-persistence-failed' events
     */
    private async persistResult(job: Job) {
        try {
            const updateJobPayload = {
                id: job.jobId,
                tools: job.tools,
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
                    operationName: `persisting job results for jobId: ${job.jobId}`,
                }
            );

            logger.info(`Successfully persisted job results for jobId: ${job.jobId}`);
        } catch (error) {
            const persistenceError = error as Error;

            logger.error(`Failed to persist job results after retries for jobId: ${job.jobId}`, {
                error: persistenceError,
            });

            throw persistenceError;
        }
    }

    /**
     * Creates a new database context for repository operations.
     *
     * This method leverages the MongoClientManager singleton to establish a database connection.
     * Each call creates a fresh context, ensuring background executions have their own scoped
     * database access and transaction capabilities. The transaction object provides access to
     * MongoDB session management for transactional operations.
     *
     * @returns A promise that resolves to a DbContext instance with database connection
     *          and transaction support
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
