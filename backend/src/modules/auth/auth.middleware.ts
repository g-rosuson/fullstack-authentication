import { type NextFunction, type Request, type Response } from 'express';

import { parseSchema } from 'lib/validation';
import response from 'response';

import inputSchema from './dto/input';
import config from './auth.config';

const validate = async (req: Request, res: Response, next: NextFunction) => {
    // Determine schema based on the request path and validate the request body
    const isRegister = req.path === config.route.register;
    const schema = isRegister ? inputSchema.registerInputDto : inputSchema.loginInputDto;
    const result = parseSchema(schema, req.body);

    if (!result.success) {
        return response.badRequest(res, { issues: result.issues });
    }

    req.body = result.data;

    next();
};

export default validate;
