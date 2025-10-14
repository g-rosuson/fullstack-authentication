import { Request, Response } from 'express';

import utils from './utils';

import { CronJobPayload } from './types';
import { HttpStatusCode } from 'shared/enums/http-status-codes';
import { IdQuery } from 'shared/types';

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

    const insertResult = await req.context.db.cronJob.create(payload);

    res.status(HttpStatusCode.CREATED).json({
        success: true,
        data: insertResult,
    });
};

/**
 * Updates an existing cron job by ID.
 *
 * @param req Express request object with typed params and body
 * @param res Express response object
 */
const updateCronJob = async (req: Request<IdQuery, unknown, CronJobPayload>, res: Response) => {
    const { id } = req.params;
    const body = req.body;

    const tmpStartDate = new Date(body.startDate);

    const payload = {
        id,
        ...body,
        nextRun: utils.getNextRunDate(body.type, tmpStartDate),
        updatedAt: new Date(body.time),
        isActive: true,
    };

    const updatedCronJob = await req.context.db.cronJob.update(payload);

    res.status(HttpStatusCode.OK).json({
        success: true,
        data: updatedCronJob,
    });
};

/**
 * Deletes a cron job by ID.
 *
 * @param req Express request object with typed params
 * @param res Express response object
 */
const deleteCronJob = async (req: Request<IdQuery>, res: Response) => {
    const { id } = req.params;

    await req.context.db.cronJob.delete(id);

    res.status(HttpStatusCode.OK).json({
        success: true,
        data: { jobId: id },
    });
};

/**
 * Retrieves a single cron job by ID.
 *
 * @param req Express request object with typed params
 * @param res Express response object
 */
const getCronJob = async (req: Request<IdQuery>, res: Response) => {
    const { id } = req.params;

    const cronJob = await req.context.db.cronJob.getById(id);

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

    const cronJobs = await req.context.db.cronJob.getAll(limit, offset);

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
