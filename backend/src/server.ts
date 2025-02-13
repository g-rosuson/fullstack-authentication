import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';

import AuthRoutes from 'api/routes/authentication';
import db from 'db';
import config from 'config';

import { shutdown } from 'server.utils';

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

// Authentication routes
server.use('/api', AuthRoutes);

const serverInstance = server.listen(1000, async () => {
    await db.connect();
    console.log(`Listening on port ${1000}`);
});

process.on('SIGTERM', () => shutdown(serverInstance, db.disconnect));
process.on('SIGINT', () => shutdown(serverInstance, db.disconnect));
