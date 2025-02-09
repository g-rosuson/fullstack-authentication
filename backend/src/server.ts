import cookieParser from 'cookie-parser'
import express from 'express';
import cors from 'cors'

import AuthRoutes from 'api/routes/authentication';

import db from 'db';

import config from 'config';

// TODO: Add custom error handling and go over status codes
// TODO: Add logger
// TODO: Validate typing
// TODO: Should we be exiting the process when the server is closed?
// TODO: Should have logic that ensures only one process is running?
// TODO: Go over folder structure
// TODO: Create tests

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

// TODO: Add validateJwt (remember to call next()) in front of protected routes
// Protected routes

server.listen(1000, async () => {
    await db.connect();
    console.log(`Listening on port ${1000}`);
});

process.on('SIGINT', async () => {
    await db.disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await db.disconnect();
    process.exit(0);
});