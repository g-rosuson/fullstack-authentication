import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import authenticationRoutes from 'modules/auth/auth-routing';
import documentationRoute from 'modules/docs/docs-routing';
import jobsRoutes from 'modules/jobs/jobs-routing';

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
    server.use(http.context.middleware.resources);

    // Routes:
    // Authentication
    server.use(config.basePath, authenticationRoutes);

    // Authenticate middleware
    server.use(config.basePath, http.context.middleware.authenticate);

    // Documentation
    server.use(config.basePath, documentationRoute);

    // Jobs
    server.use(config.basePath, jobsRoutes);

    // Exception middleware
    server.use(exceptionsMiddleware());

    return server;
};

const server = {
    init,
};

export default server;
