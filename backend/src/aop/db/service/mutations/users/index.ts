import { getDatabase } from 'aop/db/client';
import config from 'aop/db/config';
import { logger } from 'aop/logging';

import { CreateUserPayload } from 'shared/types/user';

import messages, { getMessageWithCtx } from 'messages';

const db = getDatabase();
const COLLECTION_NAME = config.db.collection.users.name;

const create = async (user: CreateUserPayload) => {
    try {
        return await db.collection(COLLECTION_NAME).insertOne(user);
    } catch (error) {
        logger.error(
            getMessageWithCtx(messages.logger.error.ADD_ITEM_TO_COLLECTION_FAILED, { name: COLLECTION_NAME }),
            { error: error as Error }
        );
        throw error; // Forward error to controller
    }
};

const mutations = {
    create,
};

export default mutations;
