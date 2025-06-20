import { getDatabase } from 'aop/db/client';
import config from 'aop/db/config';
import { logger } from 'aop/logging';

const db = getDatabase();
const COLLECTION_NAME = config.db.collection.users.name;

const create = async (userData: { email: string; password: string }) => {
    try {
        return await db.collection(COLLECTION_NAME).insertOne(userData);
    } catch (error) {
        logger.error(`Error while adding item to collection: "${COLLECTION_NAME}"`, error as Error);
        throw error; // Forward error to controller
    }
};

const mutations = {
    create,
};

export default mutations;
