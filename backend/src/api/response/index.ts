import { Response } from 'express';

import codes from 'constants/codes';
import { ErrorMessages } from 'constants/messages/types';

import { Error } from './types';

const response = {
    // Successful responses
    // 200 OK: The request was successful, and the server is returning the requested data
    success: <TData>(res: Response, data?: TData) =>
        res.status(codes.status.success).json({
            success: true,
            data,
            meta: { timestamp: Date.now() },
        }),
    // Un-successful responses
    // 400 Bad Request: The server cannot process the request due to a client-side error
    badRequest: (res: Response, error: Error) =>
        res.status(codes.status.badRequest).json({
            success: false,
            error: {
                code: codes.error.badRequest,
                ...error,
            },
            meta: { timestamp: Date.now() },
        }),
    // 401 Unauthorized: Lacks valid authentication credentials for the requested resource
    notAuthorised: (res: Response, message: ErrorMessages) =>
        res.status(codes.status.notAuthorised).json({
            success: false,
            error: { code: codes.error.notAuthorised, message },
            meta: { timestamp: Date.now() },
        }),
    // 404 Not found: The requested resource could not be found on the server
    notFound: (res: Response, message: ErrorMessages) =>
        res.status(codes.status.notFound).json({
            success: false,
            error: { code: codes.error.notFound, message },
            meta: { timestamp: Date.now() },
        }),
    // 409 Conflict: The request conflicts with the current state of the server
    conflict: (res: Response, message: ErrorMessages) =>
        res.status(codes.status.authorisationConflict).json({
            success: false,
            error: { code: codes.error.authorisationConflict, message },
            meta: { timestamp: Date.now() },
        }),
    // 500 Internal Server Error: An error indicating that something internally went wrong on the server
    internalError: (res: Response, message: ErrorMessages) => {
        return res.status(codes.status.internalServerError).json({
            success: false,
            error: { code: codes.error.internalServerError, message },
            meta: { timestamp: Date.now() },
        });
    },
};

export default response;
