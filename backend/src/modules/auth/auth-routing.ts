import { Router } from 'express';

import { forwardAsyncError } from 'aop/http/middleware/async';

import { loginLimiter, refreshLimiter, registerLimiter } from '../shared/middleware/rate-limiter';
import validateUserInput from '../shared/middleware/validate-user-input';
import { login, logout, register, renewAccessToken } from './auth-controller';
import { validateAuthenticationInput, validateRefreshToken } from './auth-middleware';

import { LOGIN_ROUTE, LOGOUT_ROUTE, REFRESH_ROUTE, REGISTER_ROUTE } from './constants';

// Determine router
const router = Router();

// Determine routes
router.post(LOGIN_ROUTE, loginLimiter, validateAuthenticationInput, forwardAsyncError(login));
router.post(
    REGISTER_ROUTE,
    registerLimiter,
    validateUserInput,
    validateAuthenticationInput,
    forwardAsyncError(register)
);
router.post(LOGOUT_ROUTE, validateRefreshToken, forwardAsyncError(logout));
router.get(REFRESH_ROUTE, refreshLimiter, validateRefreshToken, forwardAsyncError(renewAccessToken));

export default router;
