import { Db } from 'mongodb';

import { logger } from 'aop/logging';

import config from '../config';

import messages from 'messages';

const indexCollections = async (db: Db) => {
    const promises = Object.values(config.db.collection).map(item =>
        db.collection(item.name).createIndex({ [item.targetField]: item.targetValue }, { unique: item.unique })
    );

    await Promise.all(promises);

    logger.info(messages.logger.info.INDEXED_COLLECTIONS);
};

const pingDatabase = async (db: Db) => {
    await db.command({ ping: 1 });
    logger.info(messages.logger.info.PING_SUCCESS);
};

const setup = {
    indexCollections,
    pingDatabase,
};

export default setup;
