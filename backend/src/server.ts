import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import authenticationRoutes from 'modules/auth/auth.routing';
import documentationRoute from 'modules/docs/docs.routing';

import config from 'aop/config';
import { connect, disconnect } from 'aop/db';

import { shutdown, start } from 'server.utils';

const server = express();

server.use(cors({ credentials: true, origin: config.clientUrl }));

server.use(cookieParser());

// https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html
// Attackers can change the Content-Type header of the request and
// bypass request size limits. Therefore, before processing the
// request, data contained in the request should be validated
// against the content type stated in the request headers.
server.use(express.urlencoded({ extended: true, limit: '1kb' }));
server.use(express.json({ limit: '1kb' }));

// Documentation route
server.use(config.basePath, documentationRoute);

// Authentication routes
server.use(config.basePath, authenticationRoutes);

// Start server
const serverInstance = server.listen(1000, () => start(connect));

// Handle server shutdown
process.on('SIGTERM', () => shutdown(serverInstance, disconnect));
process.on('SIGINT', () => shutdown(serverInstance, disconnect));
