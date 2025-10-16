import { type NextFunction, type Request, type Response } from 'express';

import { TokenException } from 'aop/exceptions';
import { InputValidationException } from 'aop/exceptions/errors/validation';
import { parseSchema } from 'lib/validation';

import { REFRESH_TOKEN_COOKIE_NAME, REGISTER_ROUTE } from './constants';

import { ErrorMessage } from 'shared/enums/error-messages';

import { registerUserPayloadSchema } from './schemas';
import { loginUserPayloadSchema } from './schemas';

/**
 * Validates that the request body adhears to the corresponding schema.
 */
const validateAuthenticationInput = (req: Request, _res: Response, next: NextFunction) => {
    // Determine schema based on the request path
    const isRegistering = req.path === REGISTER_ROUTE;
    const schema = isRegistering ? registerUserPayloadSchema : loginUserPayloadSchema;

    // Compare request body to corresponding schema
    // Note: When registering the schema will also check if passwords match
    const result = parseSchema(schema, req.body);

    // Throw InputValidationException if the register and login schema
    // validation fail with an array of property issues and a error message
    if (!result.success) {
        throw new InputValidationException(ErrorMessage.AUTHENTICATION_SCHEMA_VALIDATION_FAILED, {
            issues: result.issues,
        });
    }

    req.body = result.data;

    next();
};

/**
 * Validates that a refreshToken request cookie exists.
 */
const validateRefreshToken = (req: Request, _res: Response, next: NextFunction) => {
    if (!req.cookies?.[REFRESH_TOKEN_COOKIE_NAME]) {
        throw new TokenException(ErrorMessage.REFRESH_TOKEN_COOKIE_NOT_FOUND);
    }

    next();
};

export { validateAuthenticationInput, validateRefreshToken };
