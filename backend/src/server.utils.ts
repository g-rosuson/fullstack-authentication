import { Server } from 'http';

import { logger } from 'services/logging';

export const shutdown = async (httpServer: Server, disconnect: () => Promise<void>) => {
    logger.info('Received shutdown signal, starting graceful shutdown...');

    try {
        // Close the HTTP server first & stop accepting new requests
        await new Promise(resolve => {
            httpServer.close(() => {
                logger.info('Server closed');
                resolve(undefined);
            });
        });

        await disconnect();
        logger.info('Database connection closed');

        process.exit(0);
    } catch (error) {
        logger.error('Error during server shutdown:', error as Error);
        process.exit(1);
    }
};
