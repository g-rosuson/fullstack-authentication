import { Db } from 'mongodb';

import { logger } from 'services/logging';

import config from '../config/config';

const indexCollections = async (db: Db) => {
    const promises = Object.values(config.db.collection).map(item =>
        db.collection(item.name).createIndex({ [item.targetField]: item.targetValue }, { unique: item.unique })
    );

    await Promise.all(promises);

    logger.info('Successfully indexed collections');
};

const pingDatabase = async (db: Db) => {
    await db.command({ ping: 1 });
    logger.info('Pinged your deployment. You successfully connected to MongoDB!');
};

const setup = {
    indexCollections,
    pingDatabase,
};

export default setup;
