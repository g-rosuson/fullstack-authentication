import { NextFunction, Request, Response } from 'express';

/**
 * Synchronous error handler that catches errors thrown in synchronous middleware
 * and passes them to Express error middleware.
 */
// eslint-disable-next-line no-unused-vars
const forwardSyncError = <T extends Request>(fn: (req: T, res: Response, next: NextFunction) => void) => {
    return (req: T, res: Response, next: NextFunction) => {
        try {
            fn(req, res, next);
        } catch (error) {
            next(error);
        }
    };
};

export { forwardSyncError };
