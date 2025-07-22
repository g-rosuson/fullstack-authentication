import { ErrorType, ExceptionContext, HttpStatusCode, ValidationIssue } from '../types';

import { BaseException } from '../base';

/**
 * Exception thrown when input validation fails.
 * Used for request body validation, query parameter validation, etc.
 */
export class ValidationException extends BaseException {
    public readonly issues: ValidationIssue[];

    /**
     * Creates a new ValidationException instance.
     *
     * @param message Human-readable error message
     * @param issues Array of specific validation issues
     * @param context Additional context information
     */
    constructor(message: string = 'Validation failed', issues: ValidationIssue[] = [], context?: ExceptionContext) {
        super(message, HttpStatusCode.BAD_REQUEST, ErrorType.VALIDATION_ERROR, context);
        this.issues = issues;
    }

    /**
     * Converts the exception to JSON with validation issues included.
     *
     * @returns Object representation including validation issues
     */
    public toJSON(): Record<string, unknown> {
        return {
            ...super.toJSON(),
            issues: this.issues,
        };
    }
}

/**
 * Exception thrown when database document schema validation fails.
 * Used by repositories when data from database doesn't match expected schema.
 */
export class SchemaValidationException extends BaseException {
    public readonly issues: ValidationIssue[];

    /**
     * Creates a new SchemaValidationException instance.
     *
     * @param message Human-readable error message
     * @param issues Array of specific schema validation issues
     * @param context Additional context information
     */
    constructor(
        message: string = 'Schema validation failed',
        issues: ValidationIssue[] = [],
        context?: ExceptionContext
    ) {
        super(message, HttpStatusCode.INTERNAL_SERVER_ERROR, ErrorType.SCHEMA_VALIDATION_ERROR, context);
        this.issues = issues;
    }

    /**
     * Converts the exception to JSON with validation issues included.
     *
     * @returns Object representation including validation issues
     */
    public toJSON(): Record<string, unknown> {
        return {
            ...super.toJSON(),
            issues: this.issues,
        };
    }
}
