import { getDatabase } from 'db/client';

const COLLECTION_NAME = 'users';

const getByField = async (fieldName: string, fieldValue: string) => {
    try {
        const db = getDatabase();

        return await db.collection(COLLECTION_NAME).findOne({ [fieldName]: fieldValue });

    } catch (error) {
        console.error((error as Error).message);
    }
}

const index = {
    getByField
}

export default index;
