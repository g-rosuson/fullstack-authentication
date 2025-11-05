import { Request, Response } from 'express';

import { logger } from 'aop/logging';

import utils from './utils';

import { CronJobPayload } from './types';
import { HttpStatusCode } from 'shared/enums/http-status-codes';
import { IdRouteParam } from 'shared/types';

/**
 * Creates a new cron job in the database and memory via scheduler.
 *
 * @param req Express request object with typed body
 * @param res Express response object
 */
const createCronJob = async (req: Request<unknown, unknown, CronJobPayload>, res: Response) => {
    const { name, type, time, startDate, endDate } = req.body;

    const tmpTime = new Date(time);
    const tmpStartDate = new Date(startDate);
    const tmpEndDate = endDate ? new Date(endDate) : null;

    const payload = {
        name,
        type,
        time,
        lastRun: null,
        nextRun: utils.getNextRunDate(type, tmpStartDate),
        startDate,
        endDate: tmpEndDate,
        createdAt: tmpTime,
        updatedAt: null,
        isActive: true,
    };

    /**
     * Start a new session for the transaction so we can rollback the
     * transaction if the cron job fails to schedule
     */
    const session = req.context.db.transaction.startSession();

    try {
        // Start a new transaction
        session.startTransaction();

        // Create the cron job in the database
        const createdCronJob = await req.context.db.repository.cronJobs.create(payload, session);

        // Schedule the cron job
        // TODO: I assume we need to have a job type ("job-scraper" etc). And depending on the type, we invoke callback methods from different services.
        const schedulePayload = {
            id: createdCronJob.id,
            name: createdCronJob.name,
            time: createdCronJob.time,
            type: createdCronJob.type,
            startDate: createdCronJob.startDate,
            endDate: createdCronJob.endDate,
            taskFn: () => Promise.resolve(),
        };

        // Schedule the cron job
        req.context.scheduler.schedule(schedulePayload);

        // Commit the transaction
        await session.commitTransaction();

        // Respond with the created cron job
        res.status(HttpStatusCode.CREATED).json({
            success: true,
            data: createdCronJob,
        });
    } catch (error) {
        // Abort the transaction
        await session.abortTransaction();

        logger.error('Failed to create cron job', { error: error as Error });

        // Re-throw the error to be handled by the error middleware
        throw error;
    } finally {
        await session.endSession();
    }
};

/**
 * Updates an existing cron job by ID.
 *
 * @param req Express request object with typed params and body
 * @param res Express response object
 */
const updateCronJob = async (req: Request<IdRouteParam, unknown, CronJobPayload>, res: Response) => {
    /**
     * Start a new session for the transaction so we can rollback the
     * transaction if the cron job fails to schedule
     */
    const session = req.context.db.transaction.startSession();

    try {
        const { id } = req.params;
        const body = req.body;

        const tmpStartDate = new Date(body.startDate);

        const payload = {
            id,
            ...body,
            nextRun: utils.getNextRunDate(body.type, tmpStartDate),
            updatedAt: new Date(body.time),
            isActive: body.isActive,
            taskFn: () => Promise.resolve(),
        };

        // Start a new transaction
        session.startTransaction();

        // Update the cron job in the database
        const updatedCronJob = await req.context.db.repository.cronJobs.update(payload, session);

        // Re-schedule the cron job
        req.context.scheduler.schedule(payload);

        // Commit the transaction
        await session.commitTransaction();

        // Respond with the updated cron job
        res.status(HttpStatusCode.OK).json({
            success: true,
            data: updatedCronJob,
        });
    } catch (error) {
        // Abort the transaction if there's an error
        await session.abortTransaction();

        logger.error('Failed to update cron job', { error: error as Error });

        // Re-throw the error to be handled by the error middleware
        throw error;
    } finally {
        await session.endSession();
    }
};

/**
 * Deletes a cron job by ID.
 *
 * @param req Express request object with typed params
 * @param res Express response object
 */
const deleteCronJob = async (req: Request<IdRouteParam>, res: Response) => {
    const { id } = req.params;

    /**
     * Start a new session for the transaction so we can rollback the
     * transaction if the cron job fails to schedule
     */
    const session = req.context.db.transaction.startSession();

    try {
        // Start a new transaction
        session.startTransaction();

        // Delete the cron job from the database
        const result = await req.context.db.repository.cronJobs.delete(id, session);

        // Delete the cron job from the scheduler
        req.context.scheduler.delete(id);

        // Commit the transaction
        await session.commitTransaction();

        // Respond with the deleted cron job
        res.status(HttpStatusCode.OK).json({
            success: true,
            data: { ...result, id },
        });
    } catch (error) {
        // Abort the transaction if there's an error
        await session.abortTransaction();

        logger.error('Failed to delete cron job', { error: error as Error });

        // Re-throw the error to be handled by the error middleware
        throw error;
    } finally {
        await session.endSession();
    }
};

/**
 * Retrieves a single cron job by ID.
 *
 * @param req Express request object with typed params
 * @param res Express response object
 */
const getCronJob = async (req: Request<IdRouteParam>, res: Response) => {
    const { id } = req.params;

    const cronJob = await req.context.db.repository.cronJobs.getById(id);

    res.status(HttpStatusCode.OK).json({
        success: true,
        data: cronJob,
    });
};

/**
 * Retrieves all cron jobs with pagination.
 *
 * @param req Express request object with query params
 * @param res Express response object
 */
const getAllCronJobs = async (req: Request, res: Response) => {
    // Parse query params with defaults
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;

    const cronJobs = await req.context.db.repository.cronJobs.getAll(limit, offset);

    res.status(HttpStatusCode.OK).json({
        success: true,
        data: {
            limit,
            offset,
            count: cronJobs.length,
            cronJobs,
        },
    });
};

export { createCronJob, deleteCronJob, getAllCronJobs, getCronJob, updateCronJob };
