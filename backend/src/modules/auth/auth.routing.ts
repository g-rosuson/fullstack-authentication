import express from 'express';

import { loginLimiter, registerLimiter, refreshLimiter } from 'shared/middleware/rate-limiter';
import { login, logout, register, renewAccessToken } from './auth.controller';
import validate from './auth.middleware';

import config from './auth.config';

// Determine router
const router = express.Router();

// Determine routes
router.post(config.route.login, loginLimiter, validate, login);
router.post(config.route.register, registerLimiter, validate, register);
router.post(config.route.logout, logout);
router.get(config.route.refresh, refreshLimiter, renewAccessToken);

export default router;
