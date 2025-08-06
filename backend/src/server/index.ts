import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import authenticationRoutes from 'modules/auth/auth-routing';
import documentationRoute from 'modules/docs/docs-routing';

import db from 'aop/db/mongo';
import { exceptionsMiddleware } from 'aop/exceptions';
import http from 'aop/http';

import config from 'config';

const init = async () => {
    const REQ_BODY_LIMIT = '6mb';
    const server = express();

    server.use(cors({ credentials: true, origin: config.clientUrl }));
    server.use(cookieParser());
    server.use(express.urlencoded({ limit: REQ_BODY_LIMIT, extended: true }));
    server.use(express.json({ limit: REQ_BODY_LIMIT }));

    // Middleware to inject context into the request object
    server.use(http.contextMiddleware);

    // Middleware to inject database context into req.context.db
    server.use(db.dbContextMiddleware);

    // Routes

    // Documentation route
    server.use(config.basePath, documentationRoute);

    // Authentication routes
    server.use(config.basePath, authenticationRoutes);

    // Exception middleware
    server.use(exceptionsMiddleware);

    return server;
};

const server = {
    init,
};

export default server;
