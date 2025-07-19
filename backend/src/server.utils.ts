import { Server } from 'http';

import { logger } from 'aop/logging';

import messages, { resolvePlaceholders } from 'constants/messages';

const start = async (dbConnect: () => Promise<void>) => {
    try {
        await dbConnect();
        // TODO: move port to config or .env?
        logger.info(resolvePlaceholders(messages.logger.info.serverStarted, { port: 1000 }));
    } catch (error) {
        logger.error(messages.logger.error.failedToSetupDb, { error: error as Error });

        // Shutdown the server
        process.exit(1);
    }
};

const shutdown = async (httpServer: Server, disconnectFromDb: () => Promise<void>) => {
    try {
        logger.info(messages.logger.info.shutdownSignal);

        // Close the HTTP server first & stop accepting new requests
        await new Promise((resolve, reject) => {
            httpServer.close(err => {
                if (err) {
                    logger.error(messages.logger.error.serverShutdownFailed, { error: err });
                    reject(err);
                } else {
                    logger.info(messages.logger.info.serverClosed);
                    resolve(undefined);
                }
            });
        });

        // Close the database connection
        // Note: If there is an error disconnectFromDb (db/client -> disconnect)
        // will log and throw the error to the catch clause below
        await disconnectFromDb();

        process.exit(0);
    } catch (error) {
        logger.error(messages.logger.error.serverShutdownFailed, { error: error as Error });
        process.exit(1);
    }
};

export { start, shutdown };
