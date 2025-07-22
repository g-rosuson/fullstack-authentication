# Exception System Documentation

## Overview

The exception system provides a comprehensive, type-safe error handling framework for the application. It follows a hierarchical structure with specialized exception classes for different error scenarios, ensuring consistent error handling and improved debugging capabilities.

## Architecture

### Core Principles

1. **Centralized Error Handling**: All errors are handled through a unified exception system
2. **Type Safety**: Strong TypeScript typing prevents runtime errors
3. **Consistent Structure**: All exceptions follow the same interface and patterns
4. **Context Preservation**: Rich context information for debugging
5. **HTTP Mapping**: Direct mapping to appropriate HTTP status codes

### Directory Structure

```
src/modules/shared/exceptions/
├── types/index.ts           # Type definitions and enums
├── base/index.ts            # Base exception class
├── validation/index.ts      # Input and schema validation exceptions
├── authentication/index.ts  # Authentication and authorization exceptions
├── resource/index.ts        # Resource-related exceptions
├── database/index.ts        # Database operation exceptions
├── external/index.ts        # External service exceptions
├── system/index.ts          # System and internal exceptions
├── index.ts                 # Central export point
└── documentation.md         # This documentation file
```

## Core Types

### ValidationIssue

Represents a single validation error with detailed information:

```typescript
interface ValidationIssue {
    path: string[];     // Path to the invalid field
    message: string;    // Human-readable error message
    code: string;       // Error code for programmatic handling
}
```

### ExceptionContext

Optional context information for debugging:

```typescript
interface ExceptionContext {
    operation?: string;    // Operation being performed
    resource?: string;     // Resource being accessed
    userId?: string;       // User ID (if applicable)
    requestId?: string;    // Request ID for tracing
    timestamp?: Date;      // When the error occurred
    [key: string]: unknown; // Additional custom context
}
```

### HttpStatusCode

Enum defining HTTP status codes used by the application:

```typescript
enum HttpStatusCode {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY = 422,
    INTERNAL_SERVER_ERROR = 500,
}
```

### ErrorType

Categorizes different types of errors:

```typescript
enum ErrorType {
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
```

## Base Exception Class

### BaseException

All application exceptions extend from `BaseException`, which provides:

- **Consistent Interface**: Implements `ApplicationException` interface
- **JSON Serialization**: `toJSON()` method for logging and API responses
- **String Representation**: `toString()` method with context information
- **Stack Trace Preservation**: Proper error stack traces
- **Timestamp Tracking**: Automatic timestamp assignment

```typescript
abstract class BaseException extends Error implements ApplicationException {
    public readonly statusCode: HttpStatusCode;
    public readonly errorType: ErrorType;
    public readonly isOperational: boolean = true;
    public readonly context?: ExceptionContext;
    public readonly timestamp: Date;
}
```

## Exception Categories

### 1. Validation Exceptions

#### ValidationException
- **Purpose**: Input validation failures (request body, query parameters)
- **Status Code**: 400 (Bad Request)
- **Use Cases**: Form validation, API parameter validation

```typescript
throw new ValidationException(
    'Invalid input data',
    [
        { path: ['email'], message: 'Invalid email format', code: 'INVALID_EMAIL' },
        { path: ['password'], message: 'Password too short', code: 'PASSWORD_LENGTH' }
    ],
    { operation: 'user_registration' }
);
```

#### SchemaValidationException
- **Purpose**: Database document schema validation failures
- **Status Code**: 500 (Internal Server Error)
- **Use Cases**: Repository layer data validation

```typescript
throw new SchemaValidationException(
    'User document validation failed',
    validationIssues,
    { email: 'user@example.com', operation: 'getByEmail' }
);
```

### 2. Authentication Exceptions

#### AuthenticationException
- **Purpose**: Authentication failures
- **Status Code**: 401 (Unauthorized)
- **Use Cases**: Invalid credentials, missing authentication

```typescript
throw new AuthenticationException(
    'Invalid credentials',
    { operation: 'login', email: 'user@example.com' }
);
```

#### AuthorizationException
- **Purpose**: Authorization failures
- **Status Code**: 403 (Forbidden)
- **Use Cases**: Insufficient permissions, role-based access control

```typescript
throw new AuthorizationException(
    'Insufficient permissions to access resource',
    { userId: '123', resource: 'admin_panel' }
);
```

#### TokenException
- **Purpose**: JWT token-related issues
- **Status Code**: 401 (Unauthorized)
- **Use Cases**: Expired tokens, malformed tokens

```typescript
throw new TokenException(
    'JWT token has expired',
    { tokenType: 'access_token', userId: '123' }
);
```

### 3. Resource Exceptions

#### NotFoundException
- **Purpose**: Requested resources not found
- **Status Code**: 404 (Not Found)
- **Use Cases**: User not found, document not found

```typescript
throw new NotFoundException(
    'User not found',
    { userId: '123', operation: 'getUserById' }
);
```

#### ConflictException
- **Purpose**: Resource conflicts
- **Status Code**: 409 (Conflict)
- **Use Cases**: Duplicate email registration, unique constraint violations

```typescript
throw new ConflictException(
    'Email already exists',
    { email: 'user@example.com', operation: 'user_registration' }
);
```

#### BusinessLogicException
- **Purpose**: Business rule violations
- **Status Code**: 422 (Unprocessable Entity)
- **Use Cases**: Domain-specific validation failures

```typescript
throw new BusinessLogicException(
    'Cannot delete user with active orders',
    { userId: '123', activeOrders: 5 }
);
```

### 4. Database Exceptions

#### DatabaseException
- **Purpose**: General database operation failures
- **Status Code**: 500 (Internal Server Error)
- **Use Cases**: Query failures, database errors

```typescript
throw new DatabaseException(
    'Failed to insert user record',
    { operation: 'insertUser', collection: 'users' }
);
```

#### DatabaseConnectionException
- **Purpose**: Database connection issues
- **Status Code**: 500 (Internal Server Error)
- **Use Cases**: Connection timeouts, network issues

```typescript
throw new DatabaseConnectionException(
    'Unable to connect to database',
    { host: 'localhost', port: 27017 }
);
```

#### DatabaseTransactionException
- **Purpose**: Transaction-related failures
- **Status Code**: 500 (Internal Server Error)
- **Use Cases**: Transaction rollbacks, deadlocks

```typescript
throw new DatabaseTransactionException(
    'Transaction failed and was rolled back',
    { transactionId: 'tx_123', operation: 'user_creation' }
);
```

### 5. External Service Exceptions

#### ExternalServiceException
- **Purpose**: Third-party service failures
- **Status Code**: 500 (Internal Server Error)
- **Use Cases**: API failures, service timeouts

```typescript
throw new ExternalServiceException(
    'Payment service unavailable',
    'stripe',
    { error: 'connection_timeout' },
    { operation: 'process_payment', amount: 100 }
);
```

#### RateLimitException
- **Purpose**: Rate limiting scenarios
- **Status Code**: 500 (Internal Server Error)
- **Use Cases**: API rate limits exceeded

```typescript
throw new RateLimitException(
    'API rate limit exceeded',
    300, // retry after 300 seconds
    { service: 'email_api', limit: '100/hour' }
);
```

### 6. System Exceptions

#### InternalException
- **Purpose**: Unexpected system errors
- **Status Code**: 500 (Internal Server Error)
- **Use Cases**: Programming bugs, unexpected conditions

```typescript
throw new InternalException(
    'Unexpected error in user service',
    { operation: 'processUser', stack: error.stack }
);
```

#### ConfigurationException
- **Purpose**: Configuration-related errors
- **Status Code**: 500 (Internal Server Error)
- **Use Cases**: Missing environment variables, invalid configuration

```typescript
throw new ConfigurationException(
    'Missing required environment variable: JWT_SECRET',
    { variable: 'JWT_SECRET', operation: 'startup' }
);
```

#### NotImplementedException
- **Purpose**: Unimplemented features
- **Status Code**: 500 (Internal Server Error)
- **Use Cases**: Placeholder implementations, unsupported operations

```typescript
throw new NotImplementedException(
    'OAuth login not yet implemented',
    { provider: 'google', operation: 'oauth_login' }
);
```

## Usage Guidelines

### 1. Repository Layer

Use schema validation exceptions for data integrity:

```typescript
// In UserRepository
async getByEmail(email: string) {
    const userDocument = await this.db.collection(this.collectionName).findOne({ email });
    
    if (!userDocument) {
        return null;
    }

    const result = parseSchema(userDocumentSchema, userDocument);

    if (!result.success) {
        throw new SchemaValidationException(
            'User document validation failed',
            result.issues,
            { email, operation: 'getByEmail' }
        );
    }

    return result.data;
}
```

### 2. Controller Layer

Use appropriate exceptions for business logic:

```typescript
// In AuthController
async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const userDocument = await req.context.db.user.getByEmail(email);

    if (!userDocument) {
        throw new NotFoundException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, userDocument.password);

    if (!isPasswordValid) {
        throw new AuthenticationException('Invalid credentials');
    }
}
```

### 3. Middleware Layer

Use validation exceptions for input validation:

```typescript
// In validation middleware
function validateInput(schema: ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            throw new ValidationException(
                'Input validation failed',
                result.issues,
                { operation: 'validateInput', schema: schema }
            );
        }

        next();
    };
}
```

## Best Practices

### 1. Exception Selection

- **Use specific exceptions**: Choose the most specific exception type for the error
- **Provide context**: Always include relevant context information
- **Clear messages**: Write human-readable error messages
- **Consistent naming**: Follow consistent naming patterns

### 2. Context Information

- **Include operation details**: What operation was being performed
- **Add resource information**: What resource was being accessed
- **Provide user context**: User ID when applicable
- **Include request tracing**: Request ID for distributed tracing

### 3. Error Messages

- **User-friendly**: Messages should be understandable by end users
- **Security-conscious**: Don't expose sensitive information
- **Actionable**: Provide guidance on how to resolve the issue
- **Consistent tone**: Maintain consistent messaging style

### 4. Performance Considerations

- **Avoid deep context**: Don't include large objects in context
- **Lazy evaluation**: Only compute context when needed
- **Memory management**: Be mindful of memory usage in high-frequency errors

## Integration with Error Middleware

The exception system is designed to work with a centralized error middleware that:

1. **Catches all exceptions**: Handles both expected and unexpected errors
2. **Maps to HTTP responses**: Converts exceptions to appropriate HTTP responses
3. **Logs errors**: Provides comprehensive error logging
4. **Sanitizes responses**: Removes sensitive information from client responses

Example error middleware integration:

```typescript
export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (error instanceof BaseException) {
        res.status(error.statusCode).json({
            success: false,
            message: error.message,
            type: error.errorType,
            timestamp: error.timestamp.toISOString(),
            ...(error instanceof ValidationException && { issues: error.issues })
        });

        return;
    }
};
```

## Testing

### Unit Testing Exceptions

```typescript
describe('ValidationException', () => {
    it('should create exception with correct properties', () => {
        const issues = [
            { path: ['email'], message: 'Invalid email', code: 'INVALID_EMAIL' }
        ];
        const context = { operation: 'test' };
        
        const exception = new ValidationException('Test message', issues, context);
        
        expect(exception.message).toBe('Test message');
        expect(exception.statusCode).toBe(HttpStatusCode.BAD_REQUEST);
        expect(exception.errorType).toBe(ErrorType.VALIDATION_ERROR);
        expect(exception.issues).toEqual(issues);
        expect(exception.context).toEqual(context);
    });
});
```

### Integration Testing

```typescript
describe('User Registration', () => {
    it('should throw ValidationException for invalid email', async () => {
        const invalidUserData = { email: 'invalid-email', password: 'password123' };
        
        await expect(authController.register(invalidUserData))
            .rejects
            .toThrow(ValidationException);
    });
});
```

## Monitoring and Logging

### Error Tracking

- **Structured logging**: Use JSON format for error logs
- **Error aggregation**: Group similar errors for analysis
- **Alert thresholds**: Set up alerts for error rate increases
- **Performance impact**: Monitor error handling performance

### Metrics

- **Error rates**: Track error frequency by type
- **Response times**: Monitor error handling latency
- **User impact**: Measure user-facing error rates
- **Recovery rates**: Track error resolution success

## Conclusion

The exception system provides a robust, type-safe foundation for error handling throughout the application. By following the established patterns and guidelines, developers can ensure consistent, maintainable error handling that improves both debugging capabilities and user experience.