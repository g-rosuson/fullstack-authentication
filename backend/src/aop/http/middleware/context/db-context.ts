import { MongoClientManager } from 'aop/db/mongo/client';
import { DbContext } from 'aop/db/mongo/context';

import type { NextFunction, Request, Response } from 'express';

const dbContextMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
    const manager = MongoClientManager.getInstance();
    const db = await manager.connect();
    req.context.db = new DbContext(db);

    next();
};

export default dbContextMiddleware;
