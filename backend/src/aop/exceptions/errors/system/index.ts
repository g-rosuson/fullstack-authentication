import { ErrorCode } from '../../shared/enums';
import { ExceptionContext } from '../../shared/types';
import { HttpStatusCode } from 'shared/enums/http-status-codes';

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
    constructor(message: string, context: ExceptionContext) {
        super(message, HttpStatusCode.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_ERROR, context);
    }
}
