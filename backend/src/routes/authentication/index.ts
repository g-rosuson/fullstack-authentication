import express from 'express';
import rateLimit from 'express-rate-limit';

import controllers from 'controllers';
import middleware from 'middleware';

// Determine router
const router = express.Router();

// Login route
const loginLimiter = rateLimit({
    // Each window is 5 hrs in ms
    windowMs: 300 * 60 * 1000,
    // Limit each IP to 8 login attempts per window
    limit: 8,
    message: 'Too many login attempts, please try again after later.',
    // Don't show rate limit info in the `RateLimit-*` headers
    standardHeaders: false,
    // Disable the `X-RateLimit-*` headers
    legacyHeaders: false,
});

router.post('/login',
    loginLimiter,
    middleware.authentication.validateLogin,
    controllers.authentication.login
);

// Register route
router.post('/register',
    middleware.authentication.validateRegistration,
    controllers.authentication.register
);

// Log-out route
router.post('/logout',
    controllers.authentication.signOut
);

// Refresh access token route
router.get('/refresh', controllers.jwt.renewAccessToken);

export default router;