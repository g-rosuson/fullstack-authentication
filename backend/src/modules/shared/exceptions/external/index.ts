import { ErrorType, ExceptionContext, HttpStatusCode } from '../types';

import { BaseException } from '../base';

/**
 * Exception thrown when external service calls fail.
 * Used for third-party API failures, service timeouts, etc.
 */
export class ExternalServiceException extends BaseException {
    public readonly serviceName?: string;
    public readonly serviceResponse?: unknown;

    /**
     * Creates a new ExternalServiceException instance.
     *
     * @param message Human-readable error message
     * @param serviceName Name of the external service that failed
     * @param serviceResponse Response from the external service (if any)
     * @param context Additional context information
     */
    constructor(
        message: string = 'External service error',
        serviceName?: string,
        serviceResponse?: unknown,
        context?: ExceptionContext
    ) {
        super(message, HttpStatusCode.INTERNAL_SERVER_ERROR, ErrorType.EXTERNAL_SERVICE_ERROR, context);
        this.serviceName = serviceName;
        this.serviceResponse = serviceResponse;
    }

    /**
     * Converts the exception to JSON with service information included.
     *
     * @returns Object representation including service details
     */
    public toJSON(): Record<string, unknown> {
        return {
            ...super.toJSON(),
            serviceName: this.serviceName,
            serviceResponse: this.serviceResponse,
        };
    }
}

/**
 * Exception thrown when external service rate limits are exceeded.
 * Used for handling API rate limiting scenarios.
 */
export class RateLimitException extends BaseException {
    public readonly retryAfter?: number;

    /**
     * Creates a new RateLimitException instance.
     *
     * @param message Human-readable error message
     * @param retryAfter Number of seconds to wait before retrying
     * @param context Additional context information
     */
    constructor(message: string = 'Rate limit exceeded', retryAfter?: number, context?: ExceptionContext) {
        super(message, HttpStatusCode.INTERNAL_SERVER_ERROR, ErrorType.EXTERNAL_SERVICE_ERROR, context);
        this.retryAfter = retryAfter;
    }

    /**
     * Converts the exception to JSON with retry information included.
     *
     * @returns Object representation including retry details
     */
    public toJSON(): Record<string, unknown> {
        return {
            ...super.toJSON(),
            retryAfter: this.retryAfter,
        };
    }
}
