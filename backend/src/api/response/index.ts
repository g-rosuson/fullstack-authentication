import { Response } from 'express';

import { Error } from './types';

const response = {
    // Successful responses
    // 200 OK: The request was successful, and the server is returning the requested data
    success: <TData>(res: Response, data: TData) =>
        res.status(200).json({
            success: true,
            data,
            meta: { timestamp: Date.now() },
        }),
    // Un-successful responses
    // 400 Bad Request: The server cannot process the request due to a client-side error
    badRequest: (res: Response, error: Error) =>
        res.status(400).json({
            success: false,
            error: {
                code: 'BAD_REQUEST',
                ...error,
            },
            meta: { timestamp: Date.now() },
        }),
    // 401 Unauthorized: Lacks valid authentication credentials for the requested resource
    notAuthorised: (res: Response) =>
        res.status(401).json({
            success: false,
            error: { code: 'NOT_AUTHORISED', message: 'not authorised' },
            meta: { timestamp: Date.now() },
        }),
    // 404 Not found: The requested resource could not be found on the server
    notFound: (res: Response, message: string) =>
        res.status(404).json({
            success: false,
            error: { code: 'NOT_FOUND', message },
            meta: { timestamp: Date.now() },
        }),
    // 409 Conflict: The request conflicts with the current state of the server
    conflict: (res: Response) =>
        res.status(409).json({
            success: false,
            error: { code: 'AUTHORISATION_CONFLICT', message: 'authorisation conflict' },
            meta: { timestamp: Date.now() },
        }),
    // 500 Internal Server Error: An error indicating that something internally went wrong on the server
    internalError: (res: Response, message?: string) => {
        let tmpMessage = 'internal server error';

        if (message) {
            tmpMessage = `${tmpMessage}: ${message}`;
        }

        return res.status(500).json({
            success: false,
            error: { code: 'INTERNAL_ERROR', message: tmpMessage },
            meta: { timestamp: Date.now() },
        });
    },
};

export default response;
