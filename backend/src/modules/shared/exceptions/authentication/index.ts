import { ErrorType, ExceptionContext, HttpStatusCode } from '../types';

import { BaseException } from '../base';

/**
 * Exception thrown when authentication fails.
 * Used when user credentials are invalid or authentication tokens are missing/expired.
 */
export class AuthenticationException extends BaseException {
    /**
     * @param message Human-readable error message
     * @param context Additional context information
     */
    constructor(message: 'Authentication failed', context?: ExceptionContext) {
        super(message, HttpStatusCode.UNAUTHORIZED, ErrorType.AUTHENTICATION_ERROR, context);
    }
}

/**
 * Exception thrown when user is authenticated but lacks permission for an action.
 * Used for role-based access control and resource-specific permissions.
 */
export class AuthorizationException extends BaseException {
    /**
     * @param message Human-readable error message
     * @param context Additional context information
     */
    constructor(message: 'Access forbidden', context?: ExceptionContext) {
        super(message, HttpStatusCode.FORBIDDEN, ErrorType.AUTHORIZATION_ERROR, context);
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
    constructor(message: 'Invalid or expired token', context?: ExceptionContext) {
        super(message, HttpStatusCode.UNAUTHORIZED, ErrorType.AUTHENTICATION_ERROR, context);
    }
}
