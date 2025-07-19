const loggerMessages = {
    info: {
        disconnectedFromDb: 'Database connection closed',
        indexedCollections: 'Successfully indexed collections',
        pingSuccess: 'Successfully pinged database: {dbName}',
        serverStarted: 'Listening on port {port}',
        shutdownSignal: 'Received shutdown signal, starting graceful shutdown...',
        serverClosed: 'Server closed',
    },
    error: {
        failedToSetupDb: 'Failed to setup database, shutting down server..',
        connectionFailed: 'Error connecting to database',
        disconnectingFailed: 'Error disconnecting from database',
        failedToPingDatabase: 'Failed to ping the database: {dbName}',
        failedToIndexCollections: 'Failed to index collection: {collectionName}. In database: {dbName}',
        addItemToCollectionFailed: 'Error while adding item to collection: "{collectionName}"',
        getItemFromCollectionFailed: 'Error while getting item from collection: "{collectionName}"',
        getItemWithEmailFromCollectionFailed:
            'Error while getting item with email: "{email}", from collection: "{collectionName}".',
        shutdownError: 'Error during server shutdown',
        serverShutdownFailed: 'Error during server shutdown',
    },
} as const;

export default loggerMessages;
