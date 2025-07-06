import { Router } from 'express';

import { login, logout, register, renewAccessToken } from './auth.controller';
import { validateAuthenticationInput, validateRefreshToken } from './auth.middleware';
import { loginLimiter, refreshLimiter, registerLimiter } from 'shared/middleware/rate-limiter';
import validateUserInput from 'shared/middleware/validate-user-input';

import config from './auth.config';

// Determine router
const router = Router();

// Determine routes
router.post(config.route.login, loginLimiter, validateAuthenticationInput, login);
router.post(config.route.register, registerLimiter, validateUserInput, validateAuthenticationInput, register);
router.post(config.route.logout, validateRefreshToken, logout);
router.get(config.route.refresh, refreshLimiter, validateRefreshToken, renewAccessToken);

export default router;
