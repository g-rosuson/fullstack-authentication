import { MongoClient, ServerApiVersion } from 'mongodb';

import { logger } from 'services/logging';

import config from 'config';

const DB_NAME = config.mongoDBName;

const client = new MongoClient(config.mongoURI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    maxPoolSize: 10,
});

const connect = async () => {
    try {
        await client.connect();

        await client.db(DB_NAME).command({ ping: 1 });
        logger.info('Pinged your deployment. You successfully connected to MongoDB!');
    } catch (error) {
        logger.error('Error connecting to MongoDB:', error as Error);
    }
};

const disconnect = async () => {
    try {
        await client.close();
        logger.info('Disconnected from MongoDB');
    } catch (error) {
        logger.error('Error disconnecting from MongoDB:', error as Error);
    }
};

const getDatabase = () => {
    if (client?.db()) {
        return client.db(DB_NAME);
    }

    throw Error('Could not access DB');
};

export { getDatabase, connect, disconnect };
