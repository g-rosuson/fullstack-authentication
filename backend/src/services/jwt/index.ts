import { sign } from 'jsonwebtoken';

import config from 'config';

import { TokenExpiration } from 'shared/enums/jwt';
import { JwtPayload } from 'shared/types/jwt';

const _signToken = (payload: JwtPayload, signAccessToken = true) => {
    const tokenSecret = signAccessToken ? config.accessTokenSecret : config.refreshTokenSecret;
    const expiresIn = signAccessToken ? TokenExpiration.Access : TokenExpiration.Refresh;

    return sign(payload, tokenSecret, { expiresIn });
};

const createTokens = (payload: JwtPayload) => {
    return { accessToken: _signToken(payload), refreshToken: _signToken(payload, false) };
};

const jwt = {
    createTokens,
};

export default jwt;
