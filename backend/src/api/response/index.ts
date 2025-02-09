import { Response } from 'express';

import { REFRESH_COOKIE_OPTIONS } from './constants';

const genericResponse = {
    // Successful responses
    // 200 OK: The request was successful, and the server is returning the requested data
    success: <T>(res: Response, data: T) => res.status(200).json({
        success: true,
        data,
        meta: { timestamp: Date.now() }
    }),

    // Un-successful responses
    // 400 Bad Request: The server cannot process the request due to a client-side error
    badRequest: (res: Response, message: string) => res.status(400).json({
        success: false,
        error: { code: 'BAD_REQUEST', message },
        meta: { timestamp: Date.now() }
    }),
    // 401 Unauthorized: Lacks valid authentication credentials for the requested resource
    notAuthorised: (res: Response) => res.status(401).json({
        success: false,
        error: { code: 'NOT_AUTHORISED', message: 'not authorised' },
        meta: { timestamp: Date.now() }
    }),
    // 404 Not found: The requested resource could not be found on the server
    notFound: (res: Response, message: string) => res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message },
        meta: { timestamp: Date.now() }
    }),
    // 409 Conflict: The request conflicts with the current state of the server
    conflict: (res: Response) => res.status(409).json({
        success: false,
        error: { code: 'AUTHORISATION_CONFLICT', message: 'authorisation conflict' },
        meta: { timestamp: Date.now() }
    }),
    // 500 Internal Server Error: A generic error indicating that something went wrong on the server
    internalError: (res: Response) => res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'internal server error' },
        meta: { timestamp: Date.now() }
    }),
};

const authenticationResponse = {
    success: (res: Response, payload: { refreshToken: string, accessToken: string, email: string, id: string }) => {
        res.cookie('refreshToken', payload.refreshToken, REFRESH_COOKIE_OPTIONS);

        return genericResponse.success(res, {
            id: payload.id,
            email: payload.email,
            accessToken: payload.accessToken
        });
    },
    logout: (res: Response) => {
        res.clearCookie('refreshToken', REFRESH_COOKIE_OPTIONS);

        return genericResponse.success(res, { loggedOut: true });
    }
};

export {
    authenticationResponse,
    genericResponse
};