import server from 'server';

/**
 * Runs the server on the desired port.
 */
const run = async (): Promise<void> => {
    const app = await server.init();

    app.listen(1000, () => {
        console.info(`🚀 Server listening on port ${1000}`);
    });
};

run();
