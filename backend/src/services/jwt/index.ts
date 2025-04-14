import { sign } from 'jsonwebtoken';

import config from 'config';

import { TokenExpiration } from 'schemas/enums/tokens';

const _signToken = (payload: { id: string; email: string }, signAccessToken = true) => {
    const tokenSecret = signAccessToken ? config.accessTokenSecret : config.refreshTokenSecret;
    const expiresIn = signAccessToken ? TokenExpiration.Access : TokenExpiration.Refresh;

    return sign(payload, tokenSecret, { expiresIn });
};

const createTokens = (userData: { id: string; email: string }) => {
    return { accessToken: _signToken(userData), refreshToken: _signToken(userData, false) };
};

const jwt = {
    createTokens,
};

export default jwt;
