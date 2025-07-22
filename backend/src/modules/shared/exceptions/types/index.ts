/* eslint-disable no-unused-vars */
/**
 * Type definitions for the exception system.
 * These types define the structure and contracts for error handling.
 */

/**
 * Validation issue structure returned by schema validation failures.
 */
export interface ValidationIssue {
    path: string[];
    message: string;
    code: string;
}

/**
 * Context information that can be attached to exceptions for debugging.
 */
export interface ExceptionContext {
    operation?: string;
    resource?: string;
    userId?: string;
    requestId?: string;
    timestamp?: Date;
    [key: string]: unknown;
}

/**
 * HTTP status codes used by the application.
 */
export enum HttpStatusCode {
    CONTINUE = 100,
    SWITCHING_PROTOCOLS = 101,
    PROCESSING = 102,
    EARLYHINTS = 103,
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NON_AUTHORITATIVE_INFORMATION = 203,
    NO_CONTENT = 204,
    RESET_CONTENT = 205,
    PARTIAL_CONTENT = 206,
    AMBIGUOUS = 300,
    MOVED_PERMANENTLY = 301,
    FOUND = 302,
    SEE_OTHER = 303,
    NOT_MODIFIED = 304,
    TEMPORARY_REDIRECT = 307,
    PERMANENT_REDIRECT = 308,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    PAYMENT_REQUIRED = 402,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    NOT_ACCEPTABLE = 406,
    PROXY_AUTHENTICATION_REQUIRED = 407,
    REQUEST_TIMEOUT = 408,
    CONFLICT = 409,
    GONE = 410,
    LENGTH_REQUIRED = 411,
    PRECONDITION_FAILED = 412,
    PAYLOAD_TOO_LARGE = 413,
    URI_TOO_LONG = 414,
    UNSUPPORTED_MEDIA_TYPE = 415,
    REQUESTED_RANGE_NOT_SATISFIABLE = 416,
    EXPECTATION_FAILED = 417,
    I_AM_A_TEAPOT = 418,
    MISDIRECTED = 421,
    UNPROCESSABLE_ENTITY = 422,
    FAILED_DEPENDENCY = 424,
    PRECONDITION_REQUIRED = 428,
    TOO_MANY_REQUESTS = 429,
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
    GATEWAY_TIMEOUT = 504,
    HTTP_VERSION_NOT_SUPPORTED = 505,
}

/**
 * Error types for categorizing different kinds of exceptions.
 */
export enum ErrorType {
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
    AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
    NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
    CONFLICT_ERROR = 'CONFLICT_ERROR',
    DATABASE_ERROR = 'DATABASE_ERROR',
    SCHEMA_VALIDATION_ERROR = 'SCHEMA_VALIDATION_ERROR',
    BUSINESS_LOGIC_ERROR = 'BUSINESS_LOGIC_ERROR',
    EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
    INTERNAL_ERROR = 'INTERNAL_ERROR',
}

/**
 * Base interface that all application exceptions must implement.
 */
export interface ApplicationException {
    readonly name: string;
    readonly message: string;
    readonly statusCode: HttpStatusCode;
    readonly errorType: ErrorType;
    readonly isOperational: boolean;
    readonly context?: ExceptionContext;
    readonly timestamp: Date;
}
