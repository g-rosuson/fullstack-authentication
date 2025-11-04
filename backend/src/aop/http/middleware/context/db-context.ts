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
    const manager = MongoClientManager.getInstance();
    const db = await manager.connect();

    req.context = {
        ...req.context,
        db: new DbContext(db),
    };

    next();
};

export default dbContextMiddleware;
