import { getDatabase } from 'aop/db/client';
import config from 'aop/db/config';
import { logger } from 'aop/logging';
import { parseSchema } from 'lib/validation';

import messages, { resolvePlaceholders } from 'constants/messages';

import { userDocumentSchema } from 'shared/schemas/user';

const COLLECTION_NAME = config.db.collection.users.name;

const getByEmail = async (email: string) => {
    try {
        const db = getDatabase();

        const document = await db.collection(COLLECTION_NAME).findOne({ email });

        const result = parseSchema(userDocumentSchema, document);

        if (!result.success) {
            const message = resolvePlaceholders(messages.logger.error.getItemWithEmailFromCollectionFailed, {
                email,
                collectionName: COLLECTION_NAME,
            });
            return logger.error(message, { issues: result.issues });
        }

        return result.data;
    } catch (error) {
        const message = resolvePlaceholders(messages.logger.error.getItemFromCollectionFailed, {
            collectionName: COLLECTION_NAME,
        });
        logger.error(message, { error: error as Error });
    }
};

const index = {
    getByEmail,
};

export default index;
