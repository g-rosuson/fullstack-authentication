import { NextFunction, Request, Response } from 'express';

import { InputValidationException } from 'aop/exceptions/errors/validation';
import { parseSchema } from 'lib/validation';

import { ErrorMessage } from 'shared/enums/error-messages';

import { cronJobPayloadSchema } from './schemas';
import { idQuerySchema, paginatedCollectionQuerySchema } from 'shared/schemas';

/**
 * Validates that the request body adhears to the corresponding schema.
 * @param req Express request object with typed body
 * @param _res Express response object
 * @param next Express next function
 */
const validatePayload = (req: Request, _res: Response, next: NextFunction) => {
    const result = parseSchema(cronJobPayloadSchema, req.body);

    if (!result.success) {
        throw new InputValidationException(ErrorMessage.CRON_JOB_SCHEMA_VALIDATION_FAILED, {
            issues: result.issues,
        });
    }

    next();
};

/**
 * Validates that the request id query params adhears to the corresponding schema.
 * @param req Express request object with typed query params
 * @param _res Express response object
 * @param next Express next function
 */
const validateIdQueryParams = (req: Request, _res: Response, next: NextFunction) => {
    const result = parseSchema(idQuerySchema, req.query);

    if (!result.success) {
        throw new InputValidationException(ErrorMessage.CRON_JOB_SCHEMA_VALIDATION_FAILED, {
            issues: result.issues,
        });
    }

    next();
};

/**
 * Validates that the request pagination query params adhears to the corresponding schema.
 * @param req Express request object with typed query params
 * @param _res Express response object
 * @param next Express next function
 */
const validatePaginationQueryParams = (req: Request, _res: Response, next: NextFunction) => {
    const result = parseSchema(paginatedCollectionQuerySchema, req.query);

    if (!result.success) {
        throw new InputValidationException(ErrorMessage.CRON_JOB_SCHEMA_VALIDATION_FAILED, {
            issues: result.issues,
        });
    }

    next();
};

export { validatePayload, validateIdQueryParams, validatePaginationQueryParams };
