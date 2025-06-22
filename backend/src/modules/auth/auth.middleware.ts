import { type NextFunction, type Request, type Response } from 'express';

import response from 'api/response';
import { parseSchema } from 'lib/validation';

import config from './auth.config';
import constants from './auth.constant';
import inputSchema from './dto/auth.input-dto';

const validateAuthenticationInput = (req: Request, res: Response, next: NextFunction) => {
    // Determine schema based on the request path and validate the request body
    const isRegistering = req.path === config.route.register;
    const schema = isRegistering ? inputSchema.registerInputDto : inputSchema.loginInputDto;
    const result = parseSchema(schema, req.body);

    if (!result.success) {
        return response.badRequest(res, { issues: result.issues });
    }

    req.body = result.data;

    next();
};

const validateRefreshToken = (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies?.[constants.REFRESH_COOKIE_NAME]) {
        return response.badRequest(res, { message: constants.NO_TOKEN_MSG });
    }

    next();
};

export { validateAuthenticationInput, validateRefreshToken };
