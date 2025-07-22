import { ErrorType, ExceptionContext, HttpStatusCode } from '../types';

import { BaseException } from '../base';

/**
 * Exception thrown for unexpected system errors and programming bugs.
 * Used when something goes wrong that shouldn't happen in normal operation.
 */
export class InternalException extends BaseException {
    /**
     * Creates a new InternalException instance.
     *
     * @param message Human-readable error message
     * @param context Additional context information
     */
    constructor(message: string = 'Internal server error', context?: ExceptionContext) {
        super(message, HttpStatusCode.INTERNAL_SERVER_ERROR, ErrorType.INTERNAL_ERROR, context);
    }
}

/**
 * Exception thrown when configuration is missing or invalid.
 * Used for environment variable validation, startup configuration checks, etc.
 */
export class ConfigurationException extends BaseException {
    /**
     * Creates a new ConfigurationException instance.
     *
     * @param message Human-readable error message
     * @param context Additional context information
     */
    constructor(message: string = 'Configuration error', context?: ExceptionContext) {
        super(message, HttpStatusCode.INTERNAL_SERVER_ERROR, ErrorType.INTERNAL_ERROR, context);
    }
}

/**
 * Exception thrown when required features or dependencies are not available.
 * Used for missing modules, unsupported operations, etc.
 */
export class NotImplementedException extends BaseException {
    /**
     * Creates a new NotImplementedException instance.
     *
     * @param message Human-readable error message
     * @param context Additional context information
     */
    constructor(message: string = 'Feature not implemented', context?: ExceptionContext) {
        super(message, HttpStatusCode.INTERNAL_SERVER_ERROR, ErrorType.INTERNAL_ERROR, context);
    }
}
