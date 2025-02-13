import { CookieOptions } from 'express';

import { TokenExpiration } from 'schemas/enums/tokens';

import config from 'config';

export const REFRESH_COOKIE_OPTIONS: CookieOptions = {
    httpOnly: true,
    secure: !config.isDeveloping,
    sameSite: 'strict',
    domain: config.domain,
    path: '/',
    maxAge: TokenExpiration.Refresh * 1000,
};
