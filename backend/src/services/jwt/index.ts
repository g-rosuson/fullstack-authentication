import { sign } from 'jsonwebtoken';

import config from 'config';

import { TokenExpiration } from 'schemas/enums/tokens';

const _signAccessToken = (payload: { id: string; email: string }) => {
    return sign(payload, config.accessTokenSecret, { expiresIn: TokenExpiration.Access });
};

const _signRefreshToken = (payload: { id: string; email: string }) => {
    return sign(payload, config.refreshTokenSecret, { expiresIn: TokenExpiration.Refresh });
};

const createTokens = (userData: { id: string; email: string }) => {
    const tokenPayload = {
        id: userData.id,
        email: userData.email,
    };

    const accessToken = _signAccessToken(tokenPayload);
    const refreshToken = _signRefreshToken(tokenPayload);

    return { accessToken, refreshToken };
};

const jwt = {
    createTokens,
};

export default jwt;
