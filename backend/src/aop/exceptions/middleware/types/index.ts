import { ValidationIssue } from 'lib/validation/types';

import { ExceptionContext } from '../../shared/types';

/**
 * Type definitions for the error handling middleware.
 * These types define the structure and contracts for error responses.
 */

/**
 * Standard error response structure sent to clients.
 */
export interface ErrorResponse {
    success: false;
    type: string;
    timestamp: string;
    issues?: ValidationIssue[];
}

/**
 * Configuration options for the error handler middleware.
 */
export interface ErrorHandlerConfig {
    includeStackTrace: boolean;
    sanitizeErrors: boolean;
    logErrors: boolean;
}

/**
 * Error logging context for structured logging.
 */
export interface ErrorLogContext {
    method: string;
    message: string;
    url: string;
    userAgent?: string;
    statusCode: number;
    errorType: string;
    ip?: string;
    userId?: string;
    stack?: string;
    context?: ExceptionContext;
}
