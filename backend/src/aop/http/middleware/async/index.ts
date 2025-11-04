import { NextFunction, Request, Response } from 'express';

/**
 * Async handler that catches promise rejections from async route handlers
 * and passes them to Express error middleware.
 *
 * This is essentialy because Express doesn't automatically catch promise rejections
 * from async functions, which can lead to unhandled promise rejections and server shutdown.
 *
 * @template T - A generic Request type that allows the TS compiler to infer the request type from the route controller function
 * @param fn - The async route handler function
 * @returns A wrapped function that catches promise rejections
 */
// eslint-disable-next-line no-unused-vars
const forwardAsyncError = <T extends Request>(fn: (req: T, res: Response, next: NextFunction) => Promise<unknown>) => {
    return (req: T, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

export { forwardAsyncError };
