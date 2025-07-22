import { dbContextMiddleware } from './middleware/db-context.middleware';

import config from './config';

const mongo = {
    dbContextMiddleware: dbContextMiddleware({ uri: config.db.uri, dbName: config.db.name }),
};

export default mongo;
