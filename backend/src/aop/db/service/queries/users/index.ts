import { getDatabase } from 'aop/db/client';
import config from 'aop/db/config';
import { logger } from 'aop/logging';

const COLLECTION_NAME = config.db.collection.users.name;

const getByEmail = async (email: string) => {
    try {
        const db = getDatabase();

        return await db.collection(COLLECTION_NAME).findOne({ email });
    } catch (error) {
        logger.error(`Error while getting item from collection: "${COLLECTION_NAME}"`, error as Error);
    }
};

const index = {
    getByEmail,
};

export default index;
