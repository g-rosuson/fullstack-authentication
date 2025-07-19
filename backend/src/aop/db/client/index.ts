import { MongoClient, ServerApiVersion } from 'mongodb';

import { logger } from 'aop/logging';

import messages from 'constants/messages';

import type { DbConfig } from '../config/types';
import type { Setup } from '../setup/types';

const client = (config: DbConfig, setup: Setup) => {
    const DB_NAME = config.db.name;

    const _client = new MongoClient(config.db.uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
        maxPoolSize: 10,
    });

    const connect = async () => {
        try {
            // Connect to client
            await _client.connect();
            const db = _client.db(DB_NAME);

            // Ping database
            // Note: pingDatabase logs and then throws the error to the catch clause below
            await setup.pingDatabase(db);

            // Index collections
            // Note: indexCollections logs and then throws the error to the catch clause below
            await setup.indexCollections(db);
        } catch (error) {
            // Throw error to the server.util.ts start function which will log and shutdown the server.
            throw error;
        }
    };

    const disconnect = async () => {
        try {
            await _client.close();
            logger.info(messages.logger.info.disconnectedFromDb);
        } catch (error) {
            logger.error(messages.logger.error.disconnectingFailed, { error: error as Error });
            throw error;
        }
    };

    const database = () => {
        if (_client?.db()) {
            return _client.db(DB_NAME);
        }

        throw Error(`Could not access DB: ${DB_NAME}`);
    };

    return { connect, disconnect, database };
};

export default client;
