import { ErrorCode, HttpStatusCode } from '../../shared/enums';
import { ExceptionContext } from '../../shared/types';

import { BaseException } from '../base';

/**
 * Exception thrown when database operations fail.
 * Used for connection failures, query errors, and other database-related issues.
 */
export class DatabaseException extends BaseException {
    /**
     * @param message Human-readable error message
     * @param context Additional context information
     */
    constructor(message: string, context: ExceptionContext) {
        super(message, HttpStatusCode.INTERNAL_SERVER_ERROR, ErrorCode.DATABASE_ERROR, context);
    }
}
