/**
 * Central export point for all exception classes and types.
 * This file provides a clean API for importing exceptions throughout the application.
 */

// Validation exceptions
export { ValidationException, SchemaValidationException } from './validation';

// Authentication and authorization exceptions
export { AuthenticationException, AuthorizationException, TokenException } from './authentication';

// Resource-related exceptions
export { NotFoundException, ConflictException, BusinessLogicException } from './resource';

// Database exceptions
export { DatabaseException, DatabaseConnectionException, DatabaseTransactionException } from './database';

// External service exceptions
export { ExternalServiceException, RateLimitException } from './external';

// System exceptions
export { InternalException, ConfigurationException, NotImplementedException } from './system';
