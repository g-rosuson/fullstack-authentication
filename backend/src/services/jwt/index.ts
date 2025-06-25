import { sign } from 'jsonwebtoken';

import config from 'aop/config';

import { TokenExpiration } from 'shared/enums';
import { JWTPayload } from 'shared/types/jwt';

const _signToken = (payload: JWTPayload, signAccessToken = true) => {
    const tokenSecret = signAccessToken ? config.accessTokenSecret : config.refreshTokenSecret;
    const expiresIn = signAccessToken ? TokenExpiration.Access : TokenExpiration.Refresh;

    return sign(payload, tokenSecret, { expiresIn });
};

const createTokens = (payload: JWTPayload) => {
    return { accessToken: _signToken(payload), refreshToken: _signToken(payload, false) };
};

const jwt = {
    createTokens,
};

export default jwt;
