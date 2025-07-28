import { ErrorType, HttpStatusCode } from '../../shared/enums';
import { ExceptionContext } from '../../shared/types';

import { BaseException } from '../base';

/**
 * Exception thrown when authentication fails.
 * Used when user credentials are invalid or authentication tokens are missing/expired.
 */
export class NotFoundException extends BaseException {
    /**
     * @param message Human-readable error message
     * @param context Additional context information
     */
    constructor(message: string, context: ExceptionContext = {}) {
        super(message, HttpStatusCode.NOT_FOUND, ErrorType.NOT_FOUND_ERROR, context);
    }
}

/**
 * Exception thrown when JWT tokens are invalid, expired, or malformed.
 * Used specifically for token-related authentication issues.
 */
export class TokenException extends BaseException {
    /**
     * @param message Human-readable error message
     * @param context Additional context information
     */
    constructor(message: string, context: ExceptionContext = {}) {
        super(message, HttpStatusCode.UNAUTHORIZED, ErrorType.AUTHENTICATION_ERROR, context);
    }
}
