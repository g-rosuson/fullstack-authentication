import { getDatabase } from 'db/client';

import { logger } from 'services/logging';

const COLLECTION_NAME = 'users';

const getByField = async (fieldName: string, fieldValue: string) => {
    try {
        const db = getDatabase();

        return await db.collection(COLLECTION_NAME).findOne({ [fieldName]: fieldValue });
    } catch (error) {
        logger.error(`Error while getting item from collection: "${COLLECTION_NAME}"`, error as Error);
    }
};

const index = {
    getByField,
};

export default index;
