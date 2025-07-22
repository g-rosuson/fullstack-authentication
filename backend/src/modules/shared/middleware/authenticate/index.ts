import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import config from 'aop/config';
import response from 'api/response';
import { parseSchema } from 'lib/validation';

import messages from 'constants/messages';

import { JWTInput } from './types';

import { jwtInputSchema } from './schemas';

/**
 * Verifies the access-token from the "authorization" header before forwarding
 * the request and granting access to protected resources.
 */
const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Check if the "authorization" header is valid
        const authHeader = req.headers?.['authorization'];

        const isHeaderInvalid = !authHeader || !authHeader.startsWith('Bearer ');

        if (isHeaderInvalid) {
            return response.badRequest(res, { message: messages.error.malformedAuthorizationHeader });
        }

        // Extract the access-token
        const accessToken = authHeader.split(' ')[1];

        // Validate and decode the access-token
        // Note: When the JWT is invalid "verify" throws an error
        const decoded = verify(accessToken, config.accessTokenSecret);

        // Validate the refresh JWT structure
        const result = parseSchema<JWTInput>(jwtInputSchema, decoded);

        if (!result.success) {
            return response.internalError(res, messages.error.invalidTokenStructure);
        }

        req.context.user = result.data;

        next();
    } catch (error) {
        response.notAuthorised(res, messages.error.notAuthorised);
    }
};

export default authenticate;
