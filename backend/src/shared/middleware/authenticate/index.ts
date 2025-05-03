import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { parseSchema } from 'lib/validation';
import response from 'api/response';
import config from 'aop/config';

import schema, { JWTInputDto } from './dto/input';

const MALFORMED_AUTHORIZATION_HEADER_MSG = 'authorization header malformed';
const INVALID_TOKEN_STRUCTURE_MSG = 'token payload structure invalid';

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
            return response.badRequest(res, { message: MALFORMED_AUTHORIZATION_HEADER_MSG });
        }

        // Extract the access-token
        const accessToken = authHeader.split(' ')[1];

        // Validate and decode the access-token
        // Note: When the JWT is invalid "verify" throws an error
        const decoded = verify(accessToken, config.accessTokenSecret);

        // Validate the refresh JWT structure
        const result = parseSchema<JWTInputDto>(schema.jwtInputDto, decoded);

        if (!result.success) {
            return response.internalError(res, INVALID_TOKEN_STRUCTURE_MSG);
        }

        req.user = result.data;

        next();
    } catch (error) {
        response.notAuthorised(res);
    }
};

export default authenticate;
