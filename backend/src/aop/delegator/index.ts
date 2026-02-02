import { MongoClientManager } from 'aop/db/mongo/client';
import { DbContext } from 'aop/db/mongo/context';
import { logger } from 'aop/logging';

import config from 'config';

import type { Job, TargetResult, ToolMap, ToolType } from './types';
import type { ExecutionPayload } from 'shared/types/jobs';

import toolRegistry from './tools';
import { retryWithFixedInterval } from 'utils';

/**
 * Singleton that routes job executions to domain-specific tools.
 * Manages job lifecycle from registration through completion.
 * Maintains queues: pendingJobs (scheduled) and runningJobs (executing).
 */
export class Delegator {
    private static instance: Delegator | null = null;
    public pendingJobs = new Map<string, Job>();
    public runningJobs = new Map<string, Job>();

    /**
     * Private constructor enforces singleton pattern.
     * Binds instance methods for correct `this` context.
     */
    private constructor() {
        this.delegate = this.delegate.bind(this);
        this.register = this.register.bind(this);
    }

    /**
     * Returns the singleton instance, creating it if needed.
     */
    static getInstance() {
        if (!Delegator.instance) {
            Delegator.instance = new Delegator();
        }

        return Delegator.instance;
    }

    /**
     * Executes a tool and returns targets with their results populated.
     * Creates a shallow copy of targets to avoid mutating the original.
     *
     * @template T Tool type extending ToolType
     * @param jobId Job identifier
     * @param tool Tool to execute
     * @returns Targets with execution results
     */
    private async targetsWithResults<T extends ToolType>(jobId: string, tool: ToolMap[T]) {
        const mappedTargets = [...tool.targets];

        const onTargetFinish = (targetResult: TargetResult) => {
            const targetToUpdate = mappedTargets.find(target => target.id === targetResult.targetId);

            if (!targetToUpdate) {
                logger.error(`Cannot find target with ID: "${targetResult.targetId}" for job with ID: "${jobId}"`, {});
            } else {
                targetToUpdate.results = targetResult.results;
            }
        };

        await toolRegistry[tool.type as T].execute({
            tool,
            onTargetFinish,
        });

        return mappedTargets;
    }

    /**
     * Executes a job by running all tools sequentially and persisting results.
     * Cleans up job queues in finally block regardless of success or failure.
     *
     * @param job Job to execute
     */
    async delegate(job: Job) {
        try {
            const tools = [...job.tools];
            const delegatedAt = new Date();

            for (let toolIndex = 0; toolIndex < tools.length; toolIndex++) {
                const tool = tools[toolIndex];
                const mappedToolTargets = await this.targetsWithResults(job.jobId, tool);
                tool.targets = mappedToolTargets;
            }

            const finishedAt = new Date();

            const executionPayload: ExecutionPayload = {
                jobId: job.jobId,
                schedule: {
                    type: job.schedule?.type || null,
                    delegatedAt,
                    finishedAt,
                },
                tools,
            };

            await this.persistResult(executionPayload);
        } catch (error) {
            logger.error(`Delegation process failed for job with ID: "${job.jobId}"`, { error: error as Error });
        } finally {
            this.runningJobs.delete(job.jobId);
            this.pendingJobs.delete(job.jobId);
        }
    }

    /**
     * Registers a job in the pending queue for later execution.
     *
     * @param job Job to register
     */
    register(job: Job) {
        this.pendingJobs.set(job.jobId, job);
    }

    /**
     * Retrieves and executes a pending job by ID.
     * Typically called by schedulers (e.g., cron jobs).
     *
     * @param jobId Scheduled job identifier
     */
    async delegateScheduledJob(jobId: string) {
        const scheduledJob = this.pendingJobs.get(jobId);

        if (!scheduledJob) {
            logger.error(`Cannot find and delegate scheduled job with ID: "${jobId}"`, {});
        } else {
            await this.delegate(scheduledJob);
        }
    }

    /**
     * Persists job results with retry logic for transient database failures.
     * Uses fixed interval retries configured via maxDbRetries and dbRetryDelayMs.
     *
     * @param executionPayload Job execution results to persist
     */
    private async persistResult(executionPayload: ExecutionPayload) {
        try {
            await retryWithFixedInterval(
                async () => {
                    const dbContext = await this.dbContext();
                    await dbContext.repository.jobs.addExecution(executionPayload);
                },
                {
                    maxAttempts: config.maxDbRetries!,
                    delayMs: config.dbRetryDelayMs!,
                    operationName: `persisting job results for jobId: ${executionPayload.jobId}`,
                }
            );

            logger.info(`Successfully persisted job results for jobId: ${executionPayload.jobId}`);
        } catch (error) {
            logger.error(`Failed to persist job results after retries for jobId: ${executionPayload.jobId}`, {
                error: error as Error,
            });
        }
    }

    /**
     * Creates a database context with connection and transaction support.
     * Each call creates a fresh context for scoped database access.
     *
     * @returns DbContext instance
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
