import { Server } from 'http';

import { logger } from 'aop/logging';

import messages from 'messages';

export const shutdown = async (httpServer: Server, disconnect: () => Promise<void>) => {
    try {
        logger.info(messages.logger.info.SHUTDOWN_SIGNAL);

        // Close the HTTP server first & stop accepting new requests
        await new Promise(resolve => {
            httpServer.close(() => {
                logger.info(messages.logger.info.SERVER_CLOSED);
                resolve(undefined);
            });
        });

        await disconnect();
        logger.info(messages.logger.info.DB_CONNECTION_CLOSED);

        process.exit(0);
    } catch (error) {
        logger.error(messages.logger.error.SHUTDOWN_ERROR, { error: error as Error });
        process.exit(1);
    }
};
