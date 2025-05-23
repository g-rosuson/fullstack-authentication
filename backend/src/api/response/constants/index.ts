import { CookieOptions } from 'express';

import { TokenExpiration } from 'shared/enums';

import config from 'aop/config';

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

export { REFRESH_COOKIE_OPTIONS, REFRESH_COOKIE_NAME };
