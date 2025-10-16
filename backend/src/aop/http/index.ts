import contextMiddleware from './middleware/context';

const http = {
    context: {
        middleware: contextMiddleware,
    },
};

export default http;
