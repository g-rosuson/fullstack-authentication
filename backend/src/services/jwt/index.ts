import { sign } from 'jsonwebtoken';

import config from 'config';

import { TokenExpiration } from 'schemas/enums/tokens';
import { IPartialUser } from 'schemas/types/authentication';

const _signAccessToken = (payload: { email: string; userId: string; }) => {
    return sign(payload, config.accessTokenSecret, { expiresIn: TokenExpiration.Access });
};

const _signRefreshToken = (payload: { userId: string }) => {
    return sign(payload, config.refreshTokenSecret, { expiresIn: '30s' });
};

const createTokens = (userData: IPartialUser) => {
    const accessTokenPayload = {
        userId: userData.id,
        email: userData.email
    }

    const refreshTokenPayload = {
        userId: userData.id,
    }

    const accessToken = _signAccessToken(accessTokenPayload)
    const refreshToken = _signRefreshToken(refreshTokenPayload)

    return { accessToken, refreshToken }
}

const jwt = {
    createTokens
};

export default jwt;