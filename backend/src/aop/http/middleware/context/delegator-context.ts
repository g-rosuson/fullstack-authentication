import { Delegator } from 'aop/delegator';
import { DelegatorContext } from 'aop/delegator/context';

import type { NextFunction, Request, Response } from 'express';

/**
 * Injects the delegator context into the request lifecycle.
 * @param req Express request object
 * @param _res Express response object
 * @param next Express next function
 */
const delegatorContextMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
    const delegatorInstance = Delegator.getInstance();
    req.context.delegator = new DelegatorContext(delegatorInstance);

    next();
};

export default delegatorContextMiddleware;
