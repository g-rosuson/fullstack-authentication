import { ErrorType, ExceptionContext, HttpStatusCode } from '../types';

import { BaseException } from '../base';

/**
 * Exception thrown when a requested resource is not found.
 * Used when users, documents, or other entities don't exist.
 */
export class NotFoundException extends BaseException {
    /**
     * Creates a new NotFoundException instance.
     *
     * @param message Human-readable error message
     * @param context Additional context information
     */
    constructor(message: string = 'Resource not found', context?: ExceptionContext) {
        super(message, HttpStatusCode.NOT_FOUND, ErrorType.NOT_FOUND_ERROR, context);
    }
}

/**
 * Exception thrown when attempting to create a resource that already exists.
 * Used for duplicate email registrations, unique constraint violations, etc.
 */
export class ConflictException extends BaseException {
    /**
     * Creates a new ConflictException instance.
     *
     * @param message Human-readable error message
     * @param context Additional context information
     */
    constructor(message: string = 'Resource already exists', context?: ExceptionContext) {
        super(message, HttpStatusCode.CONFLICT, ErrorType.CONFLICT_ERROR, context);
    }
}

/**
 * Exception thrown when business logic rules are violated.
 * Used for domain-specific validation that goes beyond simple input validation.
 */
export class BusinessLogicException extends BaseException {
    /**
     * Creates a new BusinessLogicException instance.
     *
     * @param message Human-readable error message
     * @param context Additional context information
     */
    constructor(message: string = 'Business logic violation', context?: ExceptionContext) {
        super(message, HttpStatusCode.UNPROCESSABLE_ENTITY, ErrorType.BUSINESS_LOGIC_ERROR, context);
    }
}
