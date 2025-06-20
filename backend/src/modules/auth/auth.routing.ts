import { Router } from 'express';

import { login, logout, register, renewAccessToken } from './auth.controller';
import validate from './auth.middleware';
import { loginLimiter, refreshLimiter, registerLimiter } from 'shared/middleware/rate-limiter';

import config from './auth.config';

// Determine router
const router = Router();

// Determine routes
router.post(config.route.login, loginLimiter, validate, login);
router.post(config.route.register, registerLimiter, validate, register);
router.post(config.route.logout, logout);
router.get(config.route.refresh, refreshLimiter, renewAccessToken);

export default router;
