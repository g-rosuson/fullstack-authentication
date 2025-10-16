import { Request, Response } from 'express';

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

    const createdCronJob = await req.context.db.cronJob.create(payload);

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

    req.context.scheduler.schedule(schedulePayload);

    res.status(HttpStatusCode.CREATED).json({
        success: true,
        data: createdCronJob,
    });
};

/**
 * Updates an existing cron job by ID.
 *
 * @param req Express request object with typed params and body
 * @param res Express response object
 */
const updateCronJob = async (req: Request<IdRouteParam, unknown, CronJobPayload>, res: Response) => {
    const { id } = req.params;
    const body = req.body;

    const tmpStartDate = new Date(body.startDate);

    const payload = {
        id,
        ...body,
        nextRun: utils.getNextRunDate(body.type, tmpStartDate),
        updatedAt: new Date(body.time),
        isActive: body.isActive,
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
const deleteCronJob = async (req: Request<IdRouteParam>, res: Response) => {
    const { id } = req.params;

    const result = await req.context.db.cronJob.delete(id);

    res.status(HttpStatusCode.OK).json({
        success: true,
        data: { ...result, id },
    });
};

/**
 * Retrieves a single cron job by ID.
 *
 * @param req Express request object with typed params
 * @param res Express response object
 */
const getCronJob = async (req: Request<IdRouteParam>, res: Response) => {
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
