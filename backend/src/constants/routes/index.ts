// Domains
const AUTH_DOMAIN = '/auth';

// Routes
const routes = {
    auth: {
        register: AUTH_DOMAIN + '/register',
        login: AUTH_DOMAIN + '/login',
        logout: AUTH_DOMAIN + '/logout',
        refresh: AUTH_DOMAIN + '/refresh',
    },
};

export default routes;
