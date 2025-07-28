import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import config from 'aop/config';
import { TokenException } from 'aop/exceptions';
import { InputValidationException } from 'aop/exceptions/errors/validation';
import { parseSchema } from 'lib/validation';

import { jwtInputSchema } from './schemas';

/**
 * Verifies the access-token from the "authorization" header before forwarding
 * the request and granting access to protected resources.
 */
const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
    // Check if the "authorization" header is valid
    const authHeader = req.headers?.['authorization'];

    const isHeaderInvalid = !authHeader || !authHeader.startsWith('Bearer ');

    if (isHeaderInvalid) {
        throw new InputValidationException('Authorization header is invalid');
    }

    // Extract the access-token
    const accessToken = authHeader.split(' ')[1];

    // Validate and decode the access-token
    // Note: When the JWT is invalid "verify" throws an error
    const decoded = verify(accessToken, config.accessTokenSecret);

    // Validate the refresh JWT structure
    const result = parseSchema(jwtInputSchema, decoded);

    if (!result.success) {
        throw new TokenException('Parsed access token schema is invalid');
    }

    req.context.user = result.data;

    next();
};

export default authenticate;
