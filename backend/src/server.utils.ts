import { Server } from 'http';

import { logger } from 'aop/logging';

import messages from 'constants/messages';

export const shutdown = async (httpServer: Server, disconnect: () => Promise<void>) => {
    try {
        logger.info(messages.logger.info.shutdownSignal);

        // Close the HTTP server first & stop accepting new requests
        await new Promise(resolve => {
            httpServer.close(() => {
                logger.info(messages.logger.info.serverClosed);
                resolve(undefined);
            });
        });

        await disconnect();
        logger.info(messages.logger.info.dbConnectionClosed);

        process.exit(0);
    } catch (error) {
        logger.error(messages.logger.error.shutdownError, { error: error as Error });
        process.exit(1);
    }
};
