import { getDatabase } from 'db/client';

const COLLECTION_NAME = 'users';

const create = async (userData: { email: string; password: string; refreshToken: string }) => {
    try {
        const db = getDatabase();

        return await db.collection(COLLECTION_NAME).insertOne(userData);

    } catch (error) {
        console.error((error as Error).message);
    }
}

const update = async (userId: string, fieldName: string, fieldValue: string) => {
    try {
        const db = getDatabase();

        return await db.collection(COLLECTION_NAME).updateOne({ id: userId }, { $set: { [fieldName]: fieldValue } });

    } catch (error) {
        console.error((error as Error).message);
    }
}

const mutations = {
    update,
    create
}

export default mutations;