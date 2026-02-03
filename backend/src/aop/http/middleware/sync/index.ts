import { NextFunction, Request, Response } from 'express';

/**
 * Wraps synchronous middleware to forward thrown errors to Express's error handling chain.
 *
 * Express doesn't automatically catch synchronous `throw` statements in middleware—
 * without this wrapper, such errors would bubble up unhandled rather than being routed
 * through Express's error middleware pipeline. By wrapping in try-catch and calling
 * `next(error)`, errors properly flow to your error-handling middleware.
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
