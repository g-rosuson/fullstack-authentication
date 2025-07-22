import { ApplicationException, ErrorType, ExceptionContext, HttpStatusCode } from '../types';

/**
 * Base exception class that all application exceptions extend.
 * Provides common functionality and ensures consistent error structure.
 */
export abstract class BaseException extends Error implements ApplicationException {
    public readonly statusCode: HttpStatusCode;
    public readonly errorType: ErrorType;
    public readonly isOperational: boolean = true;
    public readonly context?: ExceptionContext;
    public readonly timestamp: Date;

    /**
     * Creates a new BaseException instance.
     *
     * @param message Human-readable error message
     * @param statusCode HTTP status code for the error
     * @param errorType Category of the error
     * @param context Additional context information for debugging
     */
    constructor(message: string, statusCode: HttpStatusCode, errorType: ErrorType, context?: ExceptionContext) {
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
     * Converts the exception to a JSON representation.
     * Useful for logging and API responses.
     *
     * @returns Object representation of the exception
     */
    public toJSON(): Record<string, unknown> {
        return {
            name: this.name,
            message: this.message,
            statusCode: this.statusCode,
            errorType: this.errorType,
            isOperational: this.isOperational,
            context: this.context,
            timestamp: this.timestamp.toISOString(),
        };
    }

    /**
     * Creates a string representation of the exception.
     *
     * @returns String representation including name, message, and context
     */
    public toString(): string {
        const contextStr = this.context ? ` | Context: ${JSON.stringify(this.context)}` : '';
        return `${this.name}: ${this.message}${contextStr}`;
    }
}
