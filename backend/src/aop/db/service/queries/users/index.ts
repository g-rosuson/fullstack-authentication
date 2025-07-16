import { getDatabase } from 'aop/db/client';
import config from 'aop/db/config';
import { logger } from 'aop/logging';
import { parseSchema } from 'lib/validation';

import messages, { getMessageWithCtx } from 'messages';
import { userDocumentSchema } from 'shared/schemas/user';

const COLLECTION_NAME = config.db.collection.users.name;

const getByEmail = async (email: string) => {
    try {
        const db = getDatabase();

        const document = await db.collection(COLLECTION_NAME).findOne({ email });

        const result = parseSchema(userDocumentSchema, document);

        if (!result.success) {
            // todo: Integrate Sentry
            logger.error(
                getMessageWithCtx(messages.logger.error.GET_ITEM_WITH_EMAIL_FROM_COLLECTION_FAILED, {
                    email,
                    name: COLLECTION_NAME,
                }),
                { issues: result.issues }
            );
            return;
        }

        return result.data;
    } catch (error) {
        logger.error(
            getMessageWithCtx(messages.logger.error.GET_ITEM_FROM_COLLECTION_FAILED, { name: COLLECTION_NAME }),
            { error: error as Error }
        );
    }
};

const index = {
    getByEmail,
};

export default index;
