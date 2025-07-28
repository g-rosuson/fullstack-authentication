import { ValidationIssue } from 'lib/validation/types';

import { ErrorType, HttpStatusCode } from '../enums';

/**
 * Type definitions for the exception system.
 * These types define the structure and contracts for error handling.
 */
export interface ExceptionContext {
    error?: Error;
    issues?: ValidationIssue[];
    userId?: string;
}

/**
 * Base interface that all application exceptions must implement.
 */
export interface ApplicationException {
    readonly name: string;
    readonly message: string;
    readonly statusCode: HttpStatusCode;
    readonly errorType: ErrorType;
    readonly context: ExceptionContext;
    readonly timestamp: Date;
}
