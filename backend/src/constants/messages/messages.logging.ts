const loggerMessages = {
    info: {
        disconnected: 'Disconnected from database',
        indexedCollections: 'Successfully indexed collections',
        pingSuccess: 'Pinged your deployment. You successfully connected to the database!',
        serverStarted: 'Listening on port {port}',
        shutdownSignal: 'Received shutdown signal, starting graceful shutdown...',
        serverClosed: 'Server closed',
        dbConnectionClosed: 'Database connection closed',
    },
    error: {
        connectionFailed: 'Error connecting to database',
        disconnectingFailed: 'Error disconnecting from database',
        addItemToCollectionFailed: 'Error while adding item to collection: "{collectionName}"',
        getItemFromCollectionFailed: 'Error while getting item from collection: "{collectionName}"',
        getItemWithEmailFromCollectionFailed:
            'Error while getting item with email: "{email}", from collection: "{collectionName}".',
        shutdownError: 'Error during server shutdown',
    },
} as const;

export default loggerMessages;
