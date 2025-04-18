import { type NextFunction, type Request, type Response } from 'express';

import schema, { type AuthenticationPayload } from './auth.schemas';

import { response } from 'response';

import { parseSchema } from 'lib/validation';

const validate = async (req: Request, res: Response, next: NextFunction) => {
    const result = parseSchema<AuthenticationPayload>(schema.authentication, req.body);

    if (!result.success) {
        return response.badRequest(res, { issues: result.issues });
    }

    req.body = result.data;

    next();
};

export default validate;
