import { type NextFunction, type Request, type Response } from 'express';

import response from 'api/response';
import { parseSchema } from 'lib/validation';

import config from './auth.config';
import constants from './auth.constant';

import { loginUserPayloadSchema, registerUserPayloadSchema } from './schemas';

/**
 * Validates that the request body adhears to the corresponding schema.
 * * Success: Assign the validated data to the request body and calls next()
 * * Fail: Responds with the failed properties and corresponding error messages
 */
const validateAuthenticationInput = (req: Request, res: Response, next: NextFunction) => {
    // Determine schema based on the request path
    const isRegistering = req.path === config.route.register;
    const schema = isRegistering ? registerUserPayloadSchema : loginUserPayloadSchema;

    // Compare request body to corresponding schema
    // * Note: When registering the schema will also check if passwords match
    const result = parseSchema(schema, req.body);

    // * Register: If the comparison fails, respond with an array of the
    // * failed properties and their corresponding messages
    // * Login: If the comparison fails, respond with a generic error message
    if (!result.success) {
        const error = isRegistering
            ? { issues: result.issues, message: constants.INVALID_AUTH_MSG }
            : { message: constants.INVALID_AUTH_MSG };
        return response.badRequest(res, error);
    }

    req.body = result.data;

    next();
};

/**
 * Validates that a refreshToken request cookie exists.
 ** Success: Calls next()
 ** Fail: Responds with a generic no-token error message
 */
const validateRefreshToken = (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies?.[constants.REFRESH_COOKIE_NAME]) {
        return response.badRequest(res, { message: constants.NO_TOKEN_MSG });
    }

    next();
};

export { validateAuthenticationInput, validateRefreshToken };
