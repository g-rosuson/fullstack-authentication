import { type NextFunction, type Request, type Response } from 'express';

import response from 'api/response';
import { parseSchema } from 'lib/validation';

import config from './auth.config';
import constants from './auth.constant';
import inputSchema from './dto/auth.input-dto';

/**
 * Validates that the request body adhears to the corresponding schema.
 ** Success: Assign the validated data to the request body and calls next()
 ** Fail: Responds with the failed properties and corresponding error messages
 */
const validateAuthenticationInput = (req: Request, res: Response, next: NextFunction) => {
    // Determine schema based on the request path
    const isRegistering = req.path === config.route.register;
    const schema = isRegistering ? inputSchema.registerInputDto : inputSchema.loginInputDto;

    // Compare request body to corresponding schema
    const result = parseSchema(schema, req.body);

    // If the comparison fails, respond with an array of the
    // failed properties and their corresponding messages
    if (!result.success) {
        return response.badRequest(res, { issues: result.issues });
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
