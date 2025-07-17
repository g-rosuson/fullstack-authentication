import { Router } from 'express';

import { login, logout, register, renewAccessToken } from './auth.controller';
import { validateAuthenticationInput, validateRefreshToken } from './auth.middleware';
import { loginLimiter, refreshLimiter, registerLimiter } from 'shared/middleware/rate-limiter';
import validateUserInput from 'shared/middleware/validate-user-input';

import routes from 'constants/routes';

// Determine router
const router = Router();

// Determine routes
router.post(routes.auth.login, loginLimiter, validateAuthenticationInput, login);
router.post(routes.auth.register, registerLimiter, validateUserInput, validateAuthenticationInput, register);
router.post(routes.auth.logout, validateRefreshToken, logout);
router.get(routes.auth.refresh, refreshLimiter, validateRefreshToken, renewAccessToken);

export default router;
