import cron from 'node-cron';

import { Delegator } from 'aop/delegator';
import { ResourceNotFoundException } from 'aop/exceptions';
import { logger } from 'aop/logging';

import { CronJob, FormatCronExpressionPayload, SchedulePayload } from './types';
import { ErrorMessage } from 'shared/enums/error-messages';

/**
 * Singleton scheduler service that manages cron jobs using node-cron.
 * Provides a API for cron job lifecycle management.
 */
export class Scheduler {
    private static instance: Scheduler;
    private cronJobs: Map<string, CronJob> = new Map();

    private constructor() {}

    /**
     * Returns the singleton instance of the Scheduler.
     * Creates a new instance if one doesn't exist.
     */
    static getInstance() {
        if (!Scheduler.instance) {
            Scheduler.instance = new Scheduler();
        }

        return Scheduler.instance;
    }

    /**
     * Extracts hour and minute components from a Date object.
     *
     * @param date - The Date object to extract time from
     * @returns Object containing hour and minute as numbers
     */
    private extractTime(date: Date) {
        const hour = date.getHours();
        const minute = date.getMinutes();

        return { hour, minute };
    }

    /**
     * Formats a cron expression based on the job's type and schedule.
     * Supports daily, weekly, monthly, and yearly recurrence patterns.
     *
     * @param payload - The cron job payload containing schedule information
     * @returns A cron expression string in the format: "minute hour day-of-month month day-of-week"
     */
    private formatCronExpression(payload: FormatCronExpressionPayload) {
        const { startDate, type } = payload;
        const { hour, minute } = this.extractTime(startDate);

        const monthDay = startDate.getDate();
        const month = startDate.getMonth() + 1;
        const weekday = startDate.getDay();

        // Cron format: minute hour day-of-month month day-of-week
        switch (type) {
            case 'daily':
                // Run every day at specified time
                return `${minute} ${hour} * * *`;

            case 'weekly':
                // Run every week on the day specified in startDate at specified time
                return `${minute} ${hour} * * ${weekday}`;

            case 'monthly':
                // Run every month on the day specified in startDate at specified time
                return `${minute} ${hour} ${monthDay} * *`;

            case 'yearly':
                // Run every year on the date specified in startDate at specified time
                // Note: weekday is '*' because we want the specific calendar date, not a weekday-based rule
                return `${minute} ${hour} ${monthDay} ${month} *`;
        }
    }

    /**
     * Schedules a new cron job or updates an existing one. If a job with the
     * same ID already exists, it will be destroyed and replaced. Use this
     * method to create, restart, and update cron jobs.
     *
     * Note: We assume that the controller has validated that the start date is in the future
     *
     * The job will:
     * - Schedule to start at startDate in the future
     * - Schedule to stop at endDate if defined
     * - Run indefinitely if endDate is not defined
     *
     * @param payload - The cron job payload
     */
    schedule(payload: SchedulePayload) {
        const cronJobId = payload.id;
        const startDate = payload.startDate;
        const endDate = payload.endDate;
        const now = new Date(payload.timestamp);

        // Delete an existing job and task if it exists
        const cronJob = this.cronJobs.get(cronJobId);

        if (cronJob) {
            // Destroy the cron task from node-cron if it exists
            if (cronJob.cronTask) {
                cronJob.cronTask.destroy();
            }

            // Delete the job from map and clear any pending timeouts
            this.delete(cronJobId);
        }

        // Get an instance of the delegator
        const delegator = Delegator.getInstance();

        // For 'once' jobs, we don't need a cronTask or cronExpression
        const isOfTypeOnce = payload.type === 'once';
        let cronTask: ReturnType<typeof cron.createTask> | undefined;
        let cronExpression: string | undefined;

        if (payload.type !== 'once') {
            // Format the cron expression and create task only for recurring jobs
            cronExpression = this.formatCronExpression({ startDate, type: payload.type });
            cronTask = cron.createTask(cronExpression, () => delegator.delegateScheduledTask(cronJobId));
        }

        const newCronJob: CronJob = {
            cronTask,
            metadata: {
                startTimeoutId: undefined,
                stopTimeoutId: undefined,
            },
            endDate,
        };

        // Calculate the time to start the job
        const msToStart = startDate.getTime() - now.getTime();

        newCronJob.metadata.startTimeoutId = setTimeout(() => {
            if (isOfTypeOnce) {
                // For 'once' jobs, execute immediately via delegator
                delegator.delegateScheduledTask(cronJobId);
                logger.info(`Executed once job: ${payload.name} immediately at scheduled time`);
                this.delete(cronJobId);
            } else {
                cronTask!.start();
                logger.info(
                    `Started cron-job: ${payload.name} with expression: ${cronExpression} (type: ${payload.type})`
                );
            }
        }, msToStart);

        logger.info(
            isOfTypeOnce
                ? `Scheduled once job to execute at ${startDate.toISOString()}: ${payload.name}`
                : `Scheduled cron-job to start at ${startDate.toISOString()}: ${payload.name} with expression: ${cronExpression}`
        );

        // Calculate the time to stop the cron job (skip for 'once' jobs)
        if (endDate && !isOfTypeOnce) {
            const msToEnd = endDate.getTime() - now.getTime();

            newCronJob.metadata.stopTimeoutId = setTimeout(() => {
                cronTask!.stop();

                logger.info(`Stopped cron-job with name: "${payload.name}" and id: "${cronJobId}" (end time reached)`);
            }, msToEnd);

            logger.info(
                `Scheduled cron-job to stop at ${endDate.toISOString()}: ${payload.name} with expression: ${cronExpression}`
            );
        }

        this.cronJobs.set(cronJobId, newCronJob);
    }

    /**
     * Deletes a cron job and removes it from memory. And clears any pending
     * start/stop timeouts and destroys the underlying cron task.
     *
     * @param cronJobId - The cron job id to delete
     * @throws Error if the cron job is not found in memory
     */
    delete(cronJobId: string) {
        const cronJobById = this.cronJobs.get(cronJobId);

        if (!cronJobById) {
            throw new ResourceNotFoundException(ErrorMessage.JOBS_NOT_FOUND_IN_MEMORY);
        }

        clearTimeout(cronJobById.metadata.startTimeoutId);
        clearTimeout(cronJobById.metadata.stopTimeoutId);

        // A cronTask is not created for jobs of type 'once', therefore we don't need to destroy it
        if (cronJobById.cronTask) {
            cronJobById.cronTask.destroy();
        }

        this.cronJobs.delete(cronJobId);
        logger.info(`Deleted cron-job with id "${cronJobId}"`);
    }

    /**
     * Stops a running cron job but keeps it in memory for potential reactivation.
     * Clears any pending start/stop timeouts and stops task execution.
     * The job can be restarted later by calling schedule() again.
     *
     * @param cronJobId - The cron job id to stop
     * @throws Error if the cron job is not found in memory
     */
    stop(cronJobId: string) {
        const cronJobById = this.cronJobs.get(cronJobId);

        if (!cronJobById) {
            throw new ResourceNotFoundException(ErrorMessage.JOBS_NOT_FOUND_IN_MEMORY);
        }

        clearTimeout(cronJobById.metadata.stopTimeoutId);
        clearTimeout(cronJobById.metadata.startTimeoutId);

        cronJobById.metadata.stopTimeoutId = undefined;
        cronJobById.metadata.startTimeoutId = undefined;

        if (cronJobById.cronTask) {
            cronJobById.cronTask.stop();
        }

        logger.info(`Stopped cron-job with id: "${cronJobId}"`);
    }

    /**
     * Returns a read-only array of all scheduled cron jobs currently in memory.
     * Each entry contains the job ID, task and metadata.
     * The returned array is frozen to prevent unintended mutations at runtime.
     *
     * @returns An array of cron job objects with their id and metadata.
     */
    get allJobs() {
        const jobsArray = Array.from(this.cronJobs.entries()).map(([id, job]) => ({
            id,
            ...job,
        }));

        return Object.freeze(jobsArray);
    }
}
