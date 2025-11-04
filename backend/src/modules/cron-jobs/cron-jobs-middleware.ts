import { NextFunction, Request, Response } from 'express';

import { validateRequestPayload } from 'aop/http/validators/validators-request-payload';

import { ErrorMessage } from 'shared/enums/error-messages';

import { cronJobPayloadSchema } from './schemas';
import { idRouteParamSchema, paginatedRouteParamSchema } from 'shared/schemas/routeParam';
import { parseDate } from 'utils/time';

/**
 * Validates that the request body adhears to the corresponding schema.
 * @param req Express request object with typed body
 * @param _res Express response object
 * @param next Express next function
 */
const validatePayload = (req: Request, _res: Response, next: NextFunction) => {
    // Parse date strings into Date objects
    const parsedPayload = {
        ...req.body,
        time: parseDate(req.body.time),
        startDate: parseDate(req.body.startDate),
        endDate: req.body.endDate ? parseDate(req.body.endDate) : null,
    };

    // Validate the payload against the schema
    const validatedPayload = validateRequestPayload(
        cronJobPayloadSchema,
        parsedPayload,
        ErrorMessage.CRON_JOB_SCHEMA_VALIDATION_FAILED
    );

    req.body = validatedPayload;

    next();
};

/**
 * Validates that the request id query params adhears to the corresponding schema.
 * @param req Express request object with typed query params
 * @param _res Express response object
 * @param next Express next function
 */
const validateIdQueryParams = (req: Request, _res: Response, next: NextFunction) => {
    const validatedPayload = validateRequestPayload(
        idRouteParamSchema,
        req.query,
        ErrorMessage.CRON_JOB_SCHEMA_VALIDATION_FAILED
    );

    req.query = validatedPayload;

    next();
};

/**
 * Validates that the request pagination query params adhears to the corresponding schema.
 * @param req Express request object with typed query params
 * @param _res Express response object
 * @param next Express next function
 */
const validatePaginationQueryParams = (req: Request, _res: Response, next: NextFunction) => {
    const validatedPayload = validateRequestPayload(
        paginatedRouteParamSchema,
        req.query,
        ErrorMessage.CRON_JOB_SCHEMA_VALIDATION_FAILED
    );

    req.query = validatedPayload;

    next();
};

export { validatePayload, validateIdQueryParams, validatePaginationQueryParams };
