import { ErrorType, ExceptionContext, HttpStatusCode } from '../types';

import { BaseException } from '../base';

/**
 * Exception thrown when database operations fail.
 * Used for connection failures, query errors, and other database-related issues.
 */
export class DatabaseException extends BaseException {
    /**
     * Creates a new DatabaseException instance.
     *
     * @param message Human-readable error message
     * @param context Additional context information
     */
    constructor(message: string = 'Database operation failed', context?: ExceptionContext) {
        super(message, HttpStatusCode.INTERNAL_SERVER_ERROR, ErrorType.DATABASE_ERROR, context);
    }
}

/**
 * Exception thrown when database connection is lost or unavailable.
 * Used for connection timeouts, network issues, etc.
 */
export class DatabaseConnectionException extends BaseException {
    /**
     * Creates a new DatabaseConnectionException instance.
     *
     * @param message Human-readable error message
     * @param context Additional context information
     */
    constructor(message: string = 'Database connection failed', context?: ExceptionContext) {
        super(message, HttpStatusCode.INTERNAL_SERVER_ERROR, ErrorType.DATABASE_ERROR, context);
    }
}

/**
 * Exception thrown when database transactions fail or are rolled back.
 * Used for transaction-specific error handling.
 */
export class DatabaseTransactionException extends BaseException {
    /**
     * Creates a new DatabaseTransactionException instance.
     *
     * @param message Human-readable error message
     * @param context Additional context information
     */
    constructor(message: string = 'Database transaction failed', context?: ExceptionContext) {
        super(message, HttpStatusCode.INTERNAL_SERVER_ERROR, ErrorType.DATABASE_ERROR, context);
    }
}
