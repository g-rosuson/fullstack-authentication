import { NextFunction, Request, Response } from 'express';

import { IRegisterUserRequest } from 'schemas/types/authentication';

const validateLogin = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const hasCredentials = !!(email && password)

    if (!hasCredentials) {
        return res.status(400).send({ message: 'Email and password are required' });
    }

    next();
};

const validateRegistration =  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const hasCredentials = !!(email && password)

    if (!hasCredentials) {
        return res.status(400).send({ message: 'Email and password are required' });
    }

    (req as IRegisterUserRequest).credentials = {
        password,
        email
    }

    next();
}

const authentication = {
    validateRegistration,
    validateLogin
}

export default authentication;