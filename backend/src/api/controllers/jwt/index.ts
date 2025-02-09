import { Request, Response } from 'express';
import { verify, JwtPayload, VerifyErrors } from 'jsonwebtoken';

import { IPartialUser } from 'schemas/types/authentication';

import db from 'db';
import services from 'services';
import config from 'config';
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

    verify(
        refreshToken,
        config.refreshTokenSecret,
        (error: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
            if (error) {
                return genericResponse.notAuthorised(res);
            }

            const { accessToken } = services.jwt.createTokens(decoded as IPartialUser);

            const userData = {
                accessToken,
                email: userDocument.email,
                id: userDocument.id,
            };

            genericResponse.success(res, userData);
        }
    );
};

const jwt = {
    renewAccessToken,
};

export default jwt;
