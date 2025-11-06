import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import authenticationRoutes from 'modules/auth/auth-routing';
import cronJobsRoutes from 'modules/cron-jobs/cron-jobs-routing';
import documentationRoute from 'modules/docs/docs-routing';

// import { authenticate } from 'modules/shared/middleware/authenticate';
import { exceptionsMiddleware } from 'aop/exceptions';
import http from 'aop/http';

import config from 'config';

import { initializeDatabase } from './server-initialize-db';

const init = async () => {
    const REQ_BODY_LIMIT = '6mb';
    const server = express();

    await initializeDatabase();

    server.use(cors({ credentials: true, origin: config.clientUrl }));
    server.use(cookieParser());
    server.use(express.urlencoded({ limit: REQ_BODY_LIMIT, extended: true }));
    server.use(express.json({ limit: REQ_BODY_LIMIT }));

    // Add context to request
    server.use(http.context.middleware);

    // Routes:
    // Authentication
    server.use(config.basePath, authenticationRoutes);

    // Authenticate
    // server.use(config.basePath, authenticate);

    // Documentation
    server.use(config.basePath, documentationRoute);

    // Cron jobs
    server.use(config.basePath, cronJobsRoutes);

    // Add exception middleware
    server.use(exceptionsMiddleware());

    return server;
};

const server = {
    init,
};

export default server;
