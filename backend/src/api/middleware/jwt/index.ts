import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { isJwtPayloadValid } from 'api/shared/validators';

import config from 'config';
import { genericResponse } from 'api/response';

const validateJwt = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers?.['authorization'] || 'no';

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return genericResponse.badRequest(res, 'authorization header malformed');
    }

    const token = authHeader.split(' ')[1];

    verify(token, config.accessTokenSecret, (error, decoded) => {
        if (error) {
            return genericResponse.notAuthorised(res);
        }

        if (!isJwtPayloadValid(decoded)) {
            const message = 'token payload structure invalid';
            return genericResponse.internalError(res, message);
        }

        // Attach user data to request
        req.user = {
            id: decoded.id,
            email: decoded.email,
        };

        next();
    });
};

const jwt = {
    validateJwt,
};

export default jwt;
