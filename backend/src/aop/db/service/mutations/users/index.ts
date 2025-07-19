import { database } from 'aop/db';
import config from 'aop/db/config';
import { logger } from 'aop/logging';

import messages, { resolvePlaceholders } from 'constants/messages';

import { CreateUserPayload } from 'shared/types/user';

const COLLECTION_NAME = config.db.collection.users.name;

const create = async (user: CreateUserPayload) => {
    try {
        const tmpDb = database();
        return await tmpDb.collection(COLLECTION_NAME).insertOne(user);
    } catch (error) {
        const message = resolvePlaceholders(messages.logger.error.addItemToCollectionFailed, {
            collectionName: COLLECTION_NAME,
        });
        logger.error(message, { error: error as Error });

        throw error;
    }
};

const mutations = {
    create,
};

export default mutations;
