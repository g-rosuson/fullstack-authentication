import { ErrorCode } from '../../shared/enums';
import { ExceptionContext } from '../../shared/types';
import { HttpStatusCode } from 'shared/enums/http-status-codes';

import { BaseException } from '../base';

/**
 * Exception thrown when attempting to create a resource that already exists.
 * Used for duplicate email registrations, unique constraint violations, etc.
 */
export class ConflictException extends BaseException {
    /**
     * @param message Human-readable error message
     * @param context Additional context information
     */
    constructor(message: string, context: ExceptionContext) {
        super(message, HttpStatusCode.CONFLICT, ErrorCode.CONFLICT_ERROR, context);
    }
}

/**
 * Exception thrown when a requested resource cannot be found.
 * Used for missing users, cron jobs, or any other entity that doesn't exist.
 */
export class ResourceNotFoundException extends BaseException {
    /**
     * @param message Human-readable error message
     * @param context Additional context information (optional)
     */
    constructor(message: string, context: ExceptionContext = {}) {
        super(message, HttpStatusCode.NOT_FOUND, ErrorCode.NOT_FOUND_ERROR, context);
    }
}

/**
 * Exception thrown when a business logic rule prevents an operation from being performed.
 * Used when an operation cannot be completed due to the current state of a resource or business constraints.
 */
export class BusinessLogicException extends BaseException {
    /**
     * @param message Human-readable error message
     * @param context Additional context information (optional)
     */
    constructor(message: string, context: ExceptionContext = {}) {
        super(message, HttpStatusCode.UNPROCESSABLE_ENTITY, ErrorCode.BUSINESS_LOGIC_ERROR, context);
    }
}
