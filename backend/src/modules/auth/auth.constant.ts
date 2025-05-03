import { CookieOptions } from 'express';

import config from 'aop/config';
import { TokenExpiration } from 'shared/enums';

// Messages
const INVALID_PAYLOAD_STRUCTURE_MSG = 'invalid payload structure';
const INVALID_TOKEN_STRUCTURE_MSG = 'invalid token payload structure';
const INVALID_AUTH_MSG = 'email or password are invalid';
const NO_TOKEN_MSG = 'refresh token cookie was not found';

// Refresh cookie
const REFRESH_COOKIE_OPTIONS = (includeMaxAge = true): CookieOptions => ({
    httpOnly: true,
    secure: !config.isDeveloping,
    sameSite: 'strict',
    domain: config.domain,
    path: '/',
    ...(includeMaxAge && {
        maxAge: TokenExpiration.Refresh * 1000,
    }),
});

const REFRESH_COOKIE_NAME = 'refreshToken';

export default {
    INVALID_PAYLOAD_STRUCTURE_MSG,
    INVALID_TOKEN_STRUCTURE_MSG,
    INVALID_AUTH_MSG,
    NO_TOKEN_MSG,
    REFRESH_COOKIE_OPTIONS,
    REFRESH_COOKIE_NAME,
};
