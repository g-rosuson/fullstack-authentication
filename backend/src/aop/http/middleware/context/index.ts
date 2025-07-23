import { Context } from 'aop/http/context';

import type { NextFunction, Request, Response } from 'express';

export const contextMiddleware = (req: Request, _res: Response, next: NextFunction) => {
    req.context = new Context();

    next();
};
