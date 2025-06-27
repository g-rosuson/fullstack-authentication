import { getDatabase } from 'aop/db/client';
import config from 'aop/db/config';
import { logger } from 'aop/logging';
import { parseSchema } from 'lib/validation';

import { userDocumentSchema } from 'shared/schemas/user';

const COLLECTION_NAME = config.db.collection.users.name;

const getByEmail = async (email: string) => {
    try {
        const db = getDatabase();

        const document = await db.collection(COLLECTION_NAME).findOne({ email });

        const result = parseSchema(userDocumentSchema, document);

        if (!result.success) {
            // todo: Integrate Sentry
            const message = `Error while getting item with email: "${email}", from collection: "${COLLECTION_NAME}".`;
            logger.error(message, { issues: result.issues });
            return;
        }

        return result.data;
    } catch (error) {
        logger.error(`Error while getting item from collection: "${COLLECTION_NAME}"`, { error: error as Error });
    }
};

const index = {
    getByEmail,
};

export default index;
