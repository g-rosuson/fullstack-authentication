import { Db } from 'mongodb';

import { logger } from 'aop/logging';

import messages, { resolvePlaceholders } from 'constants/messages';

import type { DbConfig } from '../config/types';

const setup = (config: DbConfig) => {
    const DB_NAME = config.db.name;

    const pingDatabase = async (db: Db) => {
        try {
            await db.command({ ping: 1 });
            logger.info(messages.logger.info.pingSuccess);
        } catch (error) {
            const message = resolvePlaceholders(messages.logger.error.failedToPingDatabase, { dbName: DB_NAME });
            logger.error(message, { error: error as Error });

            // Note: Throw error to the db/client connect function,
            // which will catch it and log and shutdown the server.
            throw error;
        }
    };

    const indexCollections = async (db: Db) => {
        const failedCollectionErrors = [];

        // Sequentially index collections
        for (const item of Object.values(config.db.collection)) {
            try {
                await db
                    .collection(item.name)
                    .createIndex({ [item.targetField]: item.targetValue }, { unique: item.unique });

                logger.info(`Indexed collection: ${item.name}`);
            } catch (error) {
                // Collect failed collection errors
                failedCollectionErrors.push({ collectionName: item.name, error });
            }
        }

        // Log success if all collections are indexed successfully
        if (failedCollectionErrors.length === 0) {
            return logger.info(messages.logger.info.indexedCollections);
        }

        // Log all errors for failed collections
        for (const error of failedCollectionErrors) {
            const message = resolvePlaceholders(messages.logger.error.failedToIndexCollections, {
                collectionName: error.collectionName,
                dbName: DB_NAME,
            });

            logger.error(message, { error: error.error as Error });
        }

        // Note: Throw error to the db/client connect function,
        // which will catch it and log and shutdown the server.
        throw Error('Error while indexing collections');
    };

    return {
        indexCollections,
        pingDatabase,
    };
};

export default setup;
