import { CookieOptions } from 'express';

import { TokenExpiration } from 'schemas/enums/tokens';

import config from 'config';

export const REFRESH_COOKIE_OPTIONS: CookieOptions = {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: 'strict',
    domain: config.isProduction ? config.baseDomain : undefined,
    path: '/',
    maxAge: TokenExpiration.Refresh * 1000
};