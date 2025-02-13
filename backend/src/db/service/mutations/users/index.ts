import { getDatabase } from 'db/client';
import { logger } from 'services/logging';

const COLLECTION_NAME = 'users';
const db = getDatabase();

const create = async (userData: { email: string; password: string; refreshToken: string }) => {
    try {
        return await db.collection(COLLECTION_NAME).insertOne(userData);
    } catch (error) {
        logger.error(`Error while adding item to collection: "${COLLECTION_NAME}"`, error as Error);
    }
};

const update = async (userId: string, fieldName: string, fieldValue: string) => {
    try {
        return await db.collection(COLLECTION_NAME).updateOne({ id: userId }, { $set: { [fieldName]: fieldValue } });
    } catch (error) {
        logger.error(`Error while updating item in collection: "${COLLECTION_NAME}"`, error as Error);
    }
};

const mutations = {
    update,
    create,
};

export default mutations;
