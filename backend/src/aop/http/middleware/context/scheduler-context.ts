import { Scheduler } from 'aop/scheduler';
import { SchedulerContext } from 'aop/scheduler/context';

import type { NextFunction, Request, Response } from 'express';

/**
 * Injects the scheduler instance into the request context.
 * @param req Express request object
 * @param _res Express response object
 * @param next Express next function
 */
const schedulerContextMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
    const schedulerInstance = Scheduler.getInstance();
    req.context.scheduler = new SchedulerContext(schedulerInstance);

    next();
};

export default schedulerContextMiddleware;
