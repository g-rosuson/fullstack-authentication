// Domains
const AUTH_DOMAIN = '/auth';
const DOCS_DOMAIN = '/docs';

// Routes
const routes = {
    auth: {
        register: AUTH_DOMAIN + '/register',
        login: AUTH_DOMAIN + '/login',
        logout: AUTH_DOMAIN + '/logout',
        refresh: AUTH_DOMAIN + '/refresh',
    },
    docs: {
        openapi: DOCS_DOMAIN + '/openapi',
    },
};

export default routes;
