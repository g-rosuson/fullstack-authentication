import { ErrorCode } from '../../shared/enums';
import { ExceptionContext } from '../../shared/types';
import { HttpStatusCode } from 'shared/enums/http-status-codes';

import { BaseException } from '../base';

/**
 * Exception thrown when input validation fails.
 * Used for request body validation, query parameter validation, etc.
 */
export class InputValidationException extends BaseException {
    /**
     * @param message Human-readable error message
     * @param context Additional context information
     */
    constructor(message: string, context: ExceptionContext = {}) {
        super(message, HttpStatusCode.BAD_REQUEST, ErrorCode.VALIDATION_ERROR, context);
    }

    /**
     * Determines the serialized JSON representation of the exception,
     * when JSON.stringify() is called on the exception.
     */
    public toJSON() {
        return super.toJSON();
    }
}

/**
 * Exception thrown when database document schema validation fails.
 * Used by repositories when data from database doesn't match expected schema.
 */
export class SchemaValidationException extends BaseException {
    /**
     * @param message Human-readable error message
     * @param context Additional context information
     */
    constructor(message: string, context: ExceptionContext) {
        super(message, HttpStatusCode.INTERNAL_SERVER_ERROR, ErrorCode.SCHEMA_VALIDATION_ERROR, context);
    }

    /**
     * Determines the serialized JSON representation of the exception,
     * when JSON.stringify() is called on the exception.
     */
    public toJSON() {
        return super.toJSON();
    }
}
