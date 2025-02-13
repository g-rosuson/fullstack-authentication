import { NextFunction, Request, Response } from 'express';

import { genericResponse } from 'api/response';

const validateLogin = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const hasCredentials = !!(email && password);

    if (!hasCredentials) {
        return genericResponse.badRequest(res, 'email and password are required');
    }

    next();
};

const validateRegistration = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const hasCredentials = !!(email && password);

    if (!hasCredentials) {
        return genericResponse.badRequest(res, 'email and password are required');
    }

    next();
};

const authentication = {
    validateRegistration,
    validateLogin,
};

export default authentication;
