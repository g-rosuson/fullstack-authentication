import contextResourceMiddleware from './middleware/context';
import authenticateContextMiddleware from './middleware/context/authenticate-context';

const http = {
    context: {
        middleware: {
            resources: contextResourceMiddleware,
            authenticate: authenticateContextMiddleware,
        },
    },
};

export default http;
