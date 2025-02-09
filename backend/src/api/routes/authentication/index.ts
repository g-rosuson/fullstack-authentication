import express from 'express';
import rateLimit from 'express-rate-limit';

import controllers from 'api/controllers';
import middleware from 'api/middleware';

import config from './config';

// Determine router
const router = express.Router();

// Login route
const loginLimiter = rateLimit({
    windowMs: config.rateLimitSettings.windowMs,
    limit: config.rateLimitSettings.maxLoginAttempts,
    message: config.rateLimitSettings.message,
    // Don't show rate limit info in the `RateLimit-*` headers
    standardHeaders: false,
    // Disable the `X-RateLimit-*` headers
    legacyHeaders: false,
});

router.post(
    config.paths.login,
    loginLimiter,
    middleware.authentication.validateLogin,
    controllers.authentication.login
);

// Register route
router.post(config.paths.register, middleware.authentication.validateRegistration, controllers.authentication.register);

// Log-out route
router.post(config.paths.logout, controllers.authentication.signOut);

// Refresh access token route
router.get(config.paths.refresh, controllers.jwt.renewAccessToken);

export default router;
