import { MongoClientManager } from 'aop/db/mongo/client';
import dbConfig from 'aop/db/mongo/config';
import { logger } from 'aop/logging';
import { Scheduler } from 'aop/scheduler';

import config from 'config';

import { retryWithFixedInterval } from 'utils';

/**
 * Initializes database and schedules active cron jobs.
 *
 * Performs database initialization with retry logic for transient connection failures.
 * Retry behavior is configurable via environment variables:
 * - MAX_DB_RETRIES: Maximum number of retry attempts (default: 3)
 * - DB_RETRY_DELAY_MS: Fixed delay between retries in milliseconds (default: 5000)
 *
 * @throws Error if database initialization fails after all retry attempts
 */
export const initializeDatabase = async () => {
    logger.info('Initializing database connection');

    const mongoManager = MongoClientManager.getInstance({
        uri: config.mongoURI,
        dbName: config.mongoDBName,
    });

    // Connect to MongoDB with retry logic (includes ping + indexing)
    const db = await retryWithFixedInterval(() => mongoManager.connect(), {
        maxAttempts: config.maxDbRetries!,
        delayMs: config.dbRetryDelayMs!,
        operationName: 'database initialization',
    });

    logger.info('Database connection established successfully');

    // Check if all jobs are scheduled in case the server crashed
    logger.info('Checking if all cron jobs are scheduled');

    // Get all persisted cron jobs
    const persistedCronJobs = await db.collection(dbConfig.db.collection.cronJobs.name).find({}).toArray();

    if (persistedCronJobs.length) {
        // Initialize scheduler instance
        const schedulerInstance = Scheduler.getInstance();

        for (const cronJob of persistedCronJobs) {
            if (cronJob.isActive) {
                schedulerInstance.schedule({
                    id: cronJob._id.toString(),
                    name: cronJob.name,
                    time: cronJob.time,
                    type: cronJob.type,
                    startDate: cronJob.startDate,
                    endDate: cronJob.endDate,
                    taskFn: () => Promise.resolve(),
                });
            }
        }

        logger.info(`Scheduled ${persistedCronJobs.length} cron jobs successfully`);
    }

    logger.info('Database initialization completed successfully');
};
