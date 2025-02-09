import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { IPartialUserRequest } from 'schemas/types/authentication';

import config from 'config';
import { genericResponse } from 'api/response';

const validateJwt =  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers?.['authorization'] || 'no';

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return genericResponse.badRequest(res, 'Authorization header not properly formatted');
    }

    const token = authHeader.split(' ')[1];

    verify(token, config.accessTokenSecret, (error, decoded) => {
        if (error) {
            return genericResponse.notAuthorised(res);
        }

        // Check if decoded is of type JwtPayload
        if (decoded && typeof decoded !== 'string') {
            (req as IPartialUserRequest).userData = {
                userId: decoded.userId as string,
                email: decoded.email as string,
            };
        }

        res.status(200);

        next();
    });
}

const jwt = {
    validateJwt
}

export default jwt;