import { MongoClientManager } from 'aop/db/mongo/client';
import { DbContext } from 'aop/db/mongo/context';

import type { NextFunction, Request, Response } from 'express';

/**
 * Injects the database context into the request context.
 * @param req Express request object
 * @param _res Express response object
 * @param next Express next function
 */
const dbContextMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
    // Note: The manager will be already initialized in the server-initialize-db.ts file
    const manager = MongoClientManager.getInstance();

    // Note: The DB will be already connected in the server-initialize-db.ts file
    const db = await manager.connect();

    // The transaction layer provides a way to handle atomic database operations
    const transaction = {
        startSession: () => manager.startSession(),
    };

    req.context = {
        ...req.context,
        db: new DbContext(db, transaction),
    };

    next();
};

export default dbContextMiddleware;
