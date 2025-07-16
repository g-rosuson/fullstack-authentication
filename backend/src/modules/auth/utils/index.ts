import { CookieOptions } from 'express';

import config from 'aop/config';

import { TokenExpiration } from 'shared/enums';

/**
 * Returns the cookie options for the refresh token
 * @param includeMaxAge Whether to include the maxAge property
 */
const getRefreshCookieOptions = (includeMaxAge = true): CookieOptions => ({
    httpOnly: true,
    secure: !config.isDeveloping,
    sameSite: 'strict',
    domain: config.domain,
    path: '/',
    ...(includeMaxAge && {
        maxAge: TokenExpiration.Refresh * 1000,
    }),
});

const utils = {
    getRefreshCookieOptions,
};

export default utils;
