import { Request, Response } from 'express';
import { verify,  JwtPayload, VerifyErrors } from 'jsonwebtoken';

import { IPartialUser } from 'schemas/types/authentication';

import db from 'db';
import services from 'services';
import config from 'config';

const renewAccessToken = async (req: Request, res: Response) => {
    const cookies = req.cookies;

    if (!cookies?.refreshToken) {
        res.status(401).json({ message: 'No refresh token' });
        return;
    }

    const refreshToken = cookies.refreshToken;

    const userDocument = await db.service.queries.users.getByField('refreshToken', refreshToken);

    if (!userDocument) {
        res.status(403).json({ message: 'User not found' });
        return;
    }

    verify(refreshToken, config.refreshTokenSecret, (error: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
        if (error) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const { accessToken } = services.jwt.createTokens(decoded as IPartialUser);

        // TODO/NOTE: We could optionally send a refresh token
        //  as well, depending on authentication strategy?
        res.status(200).json({ accessToken });
    });
}

const jwt = {
    renewAccessToken
}

export default jwt;