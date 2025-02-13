import { Server } from 'http';

export const shutdown = async (httpServer: Server, disconnect: () => Promise<void>) => {
    console.log('Received shutdown signal, starting graceful shutdown...');

    try {
        // Close the HTTP server first & stop accepting new requests
        await new Promise(resolve => {
            httpServer.close(() => {
                console.log('Server closed');
                resolve(undefined);
            });
        });

        await disconnect();
        console.log('Database connection closed');

        process.exit(0);
    } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
};
