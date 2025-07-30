import { ValidationIssue } from 'lib/validation/types';

import { ErrorCode } from '../enums';
import { HttpStatusCode } from 'shared/enums/http-status-codes';

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
    readonly errorType: ErrorCode;
    readonly context: ExceptionContext;
    readonly timestamp: Date;
}
