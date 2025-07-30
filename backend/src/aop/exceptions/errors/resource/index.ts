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
