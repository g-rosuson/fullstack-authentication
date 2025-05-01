import { type NextFunction, type Request, type Response } from 'express';

import schema, { type AuthenticationInputDto } from './dto/input';

import response from 'response';

import { parseSchema } from 'lib/validation';

const validate = async (req: Request, res: Response, next: NextFunction) => {
    const result = parseSchema<AuthenticationInputDto>(schema.authenticationInputDto, req.body);

    if (!result.success) {
        return response.badRequest(res, { issues: result.issues });
    }

    req.body = result.data;

    next();
};

export default validate;
