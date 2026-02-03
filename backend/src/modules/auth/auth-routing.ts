import { Router } from 'express';

import { loginLimiter, refreshLimiter, registerLimiter } from '../shared/middleware/rate-limiter';
import validateUserInput from '../shared/middleware/validate-user-input';
import { login, logout, register, renewAccessToken } from './auth-controller';
import { validateAuthenticationInput, validateRefreshToken } from './auth-middleware';

import { LOGIN_ROUTE, LOGOUT_ROUTE, REFRESH_ROUTE, REGISTER_ROUTE } from './constants';

// Determine router
const router = Router();

// Determine routes
router.post(LOGIN_ROUTE, loginLimiter, validateUserInput, validateAuthenticationInput, login);
router.post(REGISTER_ROUTE, registerLimiter, validateUserInput, validateAuthenticationInput, register);
router.post(LOGOUT_ROUTE, validateRefreshToken, logout);
router.get(REFRESH_ROUTE, refreshLimiter, validateRefreshToken, renewAccessToken);

export default router;
