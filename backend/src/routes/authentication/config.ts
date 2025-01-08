const domain = '/auth';

const config = {
    paths: {
        register: domain + '/register',
        login: domain + '/login',
        logout: domain + '/logout',
        refresh: domain + '/refresh',
    },
    rateLimitSettings: {
        maxLoginAttempts: 8, // Max 8 attempts per IP address and window
        windowMs: 300 * 60 * 1000, // 5 hrs in ms
        message: 'Too many login attempts, please try again after later.',
    },
};

export default config;
