import { Request, Response } from 'express';
import { verify, type VerifyErrors, type JwtPayload } from 'jsonwebtoken';

import db from 'db';
import services from 'services';
import config from 'config';

import { isJwtPayloadValid } from 'api/shared/validators';
import { genericResponse } from 'api/response';

const renewAccessToken = async (req: Request, res: Response) => {
    const cookies = req.cookies;

    if (!cookies?.refreshToken) {
        return genericResponse.badRequest(res, 'token not present');
    }

    const refreshToken = cookies.refreshToken;

    const userDocument = await db.service.queries.users.getByField('refreshToken', refreshToken);

    if (!userDocument) {
        return genericResponse.notFound(res, 'user not found');
    }

    verify(refreshToken, config.refreshTokenSecret, (error: VerifyErrors | null, decoded?: JwtPayload | string) => {
        if (error) {
            return genericResponse.notAuthorised(res);
        }

        if (!isJwtPayloadValid(decoded)) {
            const message = 'token payload structure invalid';
            return genericResponse.internalError(res, message);
        }

        const { accessToken } = services.jwt.createTokens(decoded);

        const userData = {
            accessToken,
            email: userDocument.email,
            id: userDocument.id,
        };

        genericResponse.success(res, userData);
    });
};

const jwt = {
    renewAccessToken,
};

export default jwt;
