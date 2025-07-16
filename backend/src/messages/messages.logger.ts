const loggerMessages = {
    info: {
        DISCONNECTED: 'Disconnected from database',
        INDEXED_COLLECTIONS: 'Successfully indexed collections',
        PING_SUCCESS: 'Pinged your deployment. You successfully connected to the database!',
        SERVER_STARTED: 'Listening on port {port}',
        SHUTDOWN_SIGNAL: 'Received shutdown signal, starting graceful shutdown...',
        SERVER_CLOSED: 'Server closed',
        DB_CONNECTION_CLOSED: 'Database connection closed',
    },
    error: {
        CONNECTION_FAILED: 'Error connecting to database',
        DISCONNECTION_FAILED: 'Error disconnecting from database',
        ADD_ITEM_TO_COLLECTION_FAILED: 'Error while adding item to collection: "{name}"',
        GET_ITEM_FROM_COLLECTION_FAILED: 'Error while getting item from collection: "{name}"',
        GET_ITEM_WITH_EMAIL_FROM_COLLECTION_FAILED:
            'Error while getting item with email: "{email}", from collection: "{name}".',
        SHUTDOWN_ERROR: 'Error during server shutdown',
    },
};

export default loggerMessages;
