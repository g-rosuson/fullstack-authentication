import { Request, Response } from 'express';
import { verify,  JwtPayload, VerifyErrors } from 'jsonwebtoken';

import { IPartialUser } from 'schemas/types/authentication';

import db from 'db';
import services from 'services';
import config from 'config';

const renewAccessToken = async (req: Request, res: Response) => {
    const cookies = req.cookies;

    if (!cookies?.refreshToken) {
        return res.status(401).json({ message: 'No token present' });
    }

    const refreshToken = cookies.refreshToken;

    const userDocument = await db.service.queries.users.getByField('refreshToken', refreshToken);

    if (!userDocument) {
        return res.status(403).json({ message: 'User not found' });
    }

    verify(refreshToken, config.refreshTokenSecret, (error: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
        if (error) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { accessToken } = services.jwt.createTokens(decoded as IPartialUser);

        res.status(200).json({ accessToken });
    });
}

const jwt = {
    renewAccessToken
}

export default jwt;