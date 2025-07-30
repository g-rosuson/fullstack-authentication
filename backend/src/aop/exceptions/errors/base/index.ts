import { ErrorCode } from '../../shared/enums';
import { ApplicationException, ExceptionContext } from '../../shared/types';
import { HttpStatusCode } from 'shared/enums';

/**
 * Base exception class that all application exceptions extend.
 * Provides common functionality and ensures consistent error structure.
 */
export abstract class BaseException extends Error implements ApplicationException {
    public readonly statusCode: HttpStatusCode;
    public readonly errorType: ErrorCode;
    public readonly context: ExceptionContext;
    public readonly timestamp: Date;

    /**
     * @param message Human-readable error message
     * @param statusCode HTTP status code for the error
     * @param errorType Category of the error
     * @param context Additional context information for debugging
     */
    constructor(message: string, statusCode: HttpStatusCode, errorType: ErrorCode, context: ExceptionContext) {
        super(message);

        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.errorType = errorType;
        this.context = context;
        this.timestamp = new Date();

        // Maintains proper stack trace for where our error was thrown
        Error.captureStackTrace(this, this.constructor);
    }

    /**
     * Determines the serialized JSON representation of the exception,
     * when JSON.stringify() is called on the exception.
     */
    public toJSON() {
        return {
            name: this.name,
            message: this.message,
            statusCode: this.statusCode,
            errorType: this.errorType,
            context: this.context,
            timestamp: this.timestamp.toISOString(),
        };
    }
}
