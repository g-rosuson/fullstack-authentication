import { NextFunction, Request, Response } from 'express';

import { Scheduler } from '../';
import { SchedulerContext } from '../context';

/**
 * Injects the scheduler instance into the request context.
 * @param req Express request object
 * @param _res Express response object
 * @param next Express next function
 */
export const schedulerContextMiddleware = (req: Request, _res: Response, next: NextFunction) => {
    const schedulerInstance = Scheduler.getInstance();
    req.context.scheduler = new SchedulerContext(schedulerInstance);

    next();
};
