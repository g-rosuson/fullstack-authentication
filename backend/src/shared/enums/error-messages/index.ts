/* eslint-disable no-unused-vars */
/**
 * Error messages used by exceptions in the application.
 */
export enum ErrorMessage {
    USER_NOT_FOUND = 'User not found',
    USER_ALREADY_EXISTS = 'User already exists',
    USER_PASSWORD_WRONG = 'Wrong credentials',
    TOKEN_INVALID = 'Parsed token schema is invalid',
    REFRESH_TOKEN_COOKIE_NOT_FOUND = 'Refresh token cookie not found',
    AUTHENTICATION_SCHEMA_VALIDATION_FAILED = 'Authentication schema validation failed',
    AUTHENTICATION_HEADER_INVALID = 'Authorization header is invalid',
    INVALID_REQUEST_BODY = 'Invalid request body. Expected a JSON object but got: ',
    HTML_TAGS_DETECTED = 'Invalid request body. HTML tags detected',
    SCHEMA_VALIDATION_FAILED = 'Schema validation failed',
    CONFLICT_ERROR = 'Database conflict error',
    DATABASE_ERROR = 'Database error',
    TOKEN_ERROR = 'Token error',
    UNEXPECTED_ERROR = 'Unexpected error',
}
