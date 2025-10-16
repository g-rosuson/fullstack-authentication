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
    CRON_JOB_SCHEMA_VALIDATION_FAILED = 'Cron job schema validation failed',
    CRON_JOB_NOT_FOUND_IN_DATABASE = 'Cron job not found in database',
    CRON_JOB_NOT_FOUND_IN_MEMORY = 'Cron job not found in memory',
    CRON_JOB_START_DATE_IN_FUTURE = 'Start date must be in the future',
    CRON_JOB_START_DATE_COME_BEFORE_END_DATE = 'Start date must come before end date',
    DATABASE_OPERATION_FAILED_ERROR = 'Database operation failed',
    MONGO_CLIENT_MANAGER_INSTANCE_NOT_FOUND = 'Options are required to create a new MongoClientManager instance',
}

/**
 * Error messages for environment variable validation.
 */
export enum EnvErrorMessage {
    ACCESS_TOKEN_SECRET_REQUIRED = 'ACCESS_TOKEN_SECRET is required',
    REFRESH_TOKEN_SECRET_REQUIRED = 'REFRESH_TOKEN_SECRET is required',
    MONGO_URI_INVALID = 'MONGO_URI must be a valid URL',
    MONGO_DB_NAME_REQUIRED = 'MONGO_DB_NAME is required',
    BASE_ROUTE_PATH_REQUIRED = 'BASE_ROUTE_PATH is required',
    NODE_ENV_REQUIRED = 'NODE_ENV must be either "development" or "production"',
    DEV_CLIENT_URL_REQUIRED = 'DEV_CLIENT_URL must be a valid URL',
    DEV_DOMAIN_REQUIRED = 'DEV_DOMAIN is required',
    PROD_CLIENT_URL_REQUIRED = 'PROD_CLIENT_URL must be a valid URL',
    PROD_DOMAIN_REQUIRED = 'PROD_DOMAIN is required',
    MAX_DB_RETRIES_INVALID = 'MAX_DB_RETRIES must be a positive integer',
    DB_RETRY_DELAY_MS_INVALID = 'DB_RETRY_DELAY_MS must be a positive integer',
}
