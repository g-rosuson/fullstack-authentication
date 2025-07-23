import { ErrorType, ExceptionContext, HttpStatusCode } from '../types';

import { BaseException } from '../base';

/**
 * Exception thrown for unexpected system errors and programming bugs.
 * Used when something goes wrong that shouldn't happen in normal operation.
 */
export class InternalException extends BaseException {
    /**
     * @param message Human-readable error message
     * @param context Additional context information
     */
    constructor(message: 'Internal server error', context?: ExceptionContext) {
        super(message, HttpStatusCode.INTERNAL_SERVER_ERROR, ErrorType.INTERNAL_ERROR, context);
    }
}

/**
 * Exception thrown when configuration is missing or invalid.
 * Used for environment variable validation, startup configuration checks, etc.
 */
export class ConfigurationException extends BaseException {
    /**
     * @param message Human-readable error message
     * @param context Additional context information
     */
    constructor(message: 'Configuration error', context?: ExceptionContext) {
        super(message, HttpStatusCode.INTERNAL_SERVER_ERROR, ErrorType.INTERNAL_ERROR, context);
    }
}
