import { MongoClient, ServerApiVersion } from 'mongodb';

import { logger } from 'aop/logging';

import config from '../config';
import setup from '../setup';
import messages from 'constants/messages';

const DB_NAME = config.db.name;

const client = new MongoClient(config.db.uri, {
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
        const db = client.db(DB_NAME);

        await setup.pingDatabase(db);
        await setup.indexCollections(db);
    } catch (error) {
        logger.error(messages.logger.error.connectionFailed, { error: error as Error });
    }
};

const disconnect = async () => {
    try {
        await client.close();
        logger.info(messages.logger.info.disconnected);
    } catch (error) {
        logger.error(messages.logger.error.disconnectingFailed, { error: error as Error });
    }
};

const getDatabase = () => {
    if (client?.db()) {
        return client.db(DB_NAME);
    }

    // TODO: This will be caught in mutations/queries and logged wrongly as an error while accessing collection.
    throw Error('Could not access DB');
};

export { getDatabase, connect, disconnect };
