# AI Context - Backend Code Generation Guide

## Project Overview
- **Framework**: Node.js + Express + TypeScript
- **Database**: MongoDB with Repository pattern
- **Validation**: Zod schemas with OpenAPI generation
- **Architecture**: AOP (Aspect-Oriented Programming) with feature modules
- **Error Handling**: Custom exception hierarchy with BaseException

## Critical Patterns to Follow

### 1. File Organization
```
src/
├── aop/                    # Cross-cutting concerns
├── modules/               # Feature modules (auth, users, etc.)
│   ├── feature-name/
│   │   ├── constants/index.ts
│   │   ├── schemas/index.ts
│   │   ├── types/index.ts
│   │   ├── utils/index.ts
│   │   ├── feature-controller.ts
│   │   ├── feature-middleware.ts
│   │   └── feature-routing.ts
├── services/              # Business logic
├── shared/               # Enums, types, constants
└── config/               # Configuration
```

### 2. Import Order (ESLint Rule)
```typescript
// 1. External packages
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';

// 2. Module imports
import { CreateUserPayload } from 'modules/shared/types/user';

// 3. AOP imports
import { TokenException } from 'aop/exceptions';
import { parseSchema } from 'lib/validation';

// 4. Config
import config from 'config';

// 5. Local types/enums
import { JwtPayload } from './types';
import { ErrorMessage } from 'shared/enums/error-messages';
```

### 3. Controller Pattern
```typescript
/**
 * Brief description of what the function does.
 * Include important notes about side effects.
 * 
 * @param req Express request object with typed body
 * @param res Express response object
 * @throws SpecificException if something goes wrong
 */
const functionName = async (req: Request<unknown, unknown, PayloadType>, res: Response) => {
    const { field1, field2 } = req.body;

    // Business logic here
    
    res.status(HttpStatusCode.OK).json({
        success: true,
        data: responseData,
        meta: { timestamp: Date.now() },
    });
};
```

### 4. Schema Definition
```typescript
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

const payloadSchema = z
    .object({
        field1: z.string(),
        field2: z.string().email(),
    })
    .openapi('PayloadType');
```

### 5. Type Definition
```typescript
import { z } from 'zod';
import { payloadSchema } from '../schemas';

type PayloadType = z.infer<typeof payloadSchema>;

export type { PayloadType };
```

### 6. Repository Pattern
```typescript
export class EntityRepository {
    private db: Db;
    private collectionName: string;

    constructor(db: Db) {
        this.db = db;
        this.collectionName = config.db.collection.entity.name;
    }

    async getById(id: string) {
        const document = await this.db.collection(this.collectionName).findOne({ _id: id });
        const result = parseSchema(documentSchema, document);
        
        if (!result.success) {
            throw new SchemaValidationException(ErrorMessage.SCHEMA_VALIDATION_FAILED, { issues: result.issues });
        }
        
        return result.data;
    }
}
```

### 7. Error Handling
```typescript
// Always extend BaseException
export class CustomException extends BaseException {
    constructor(message: string, context: ExceptionContext = {}) {
        super(message, HttpStatusCode.BAD_REQUEST, ErrorCode.VALIDATION, context);
    }
}

// Use in controllers
if (!isValid) {
    throw new UnauthorizedException(ErrorMessage.USER_NOT_FOUND);
}
```

### 8. Route Definition
```typescript
import { Router } from 'express';
import { rateLimiter } from '../shared/middleware/rate-limiter';
import validateUserInput from '../shared/middleware/validate-user-input';
import { functionName } from './feature-controller';
import { validateInput } from './feature-middleware';
import { ROUTE_PATH } from './constants';

const router = Router();

router.post(ROUTE_PATH, rateLimiter, validateUserInput, validateInput, functionName);

export default router;
```

### 9. Constants
```typescript
export const ROUTE_PATH = '/feature';
export const COLLECTION_NAME = 'features';
```

### 10. Response Format
```typescript
// Success response
{
    success: true,
    data: any,
    meta: { timestamp: number }
}

// Error response (handled by exception middleware)
{
    name: "ExceptionName",
    message: "Human readable message",
    statusCode: 400,
    errorType: "ERROR_CATEGORY",
    context: {},
    timestamp: "2024-01-01T00:00:00.000Z"
}
```

## Common File Templates

### Controller Template
```typescript
import { Request, Response } from 'express';
import { PayloadType } from './types';
import { HttpStatusCode } from 'shared/enums/http-status-codes';

const functionName = async (req: Request<unknown, unknown, PayloadType>, res: Response) => {
    const { field1, field2 } = req.body;

    // Implementation here

    res.status(HttpStatusCode.OK).json({
        success: true,
        data: result,
        meta: { timestamp: Date.now() },
    });
};

export { functionName };
```

### Schema Template
```typescript
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

const payloadSchema = z
    .object({
        // Define fields here
    })
    .openapi('PayloadType');

export { payloadSchema };
```

### Repository Template
```typescript
import { Db } from 'mongodb';
import { SchemaValidationException } from 'aop/exceptions';
import { parseSchema } from 'lib/validation';
import config from '../../config';
import { ErrorMessage } from 'shared/enums/error-messages';
import { documentSchema } from './schemas';

export class EntityRepository {
    private db: Db;
    private collectionName: string;

    constructor(db: Db) {
        this.db = db;
        this.collectionName = config.db.collection.entity.name;
    }

    async methodName(param: string) {
        // Implementation here
    }
}
```

## Things to Avoid

1. **Don't** use `interface` - prefer `type` for simple type aliases
2. **Don't** use double quotes - always use single quotes
3. **Don't** skip JSDoc comments for public functions
4. **Don't** use generic error messages - use specific ErrorMessage enum
5. **Don't** access database directly - always use repository pattern
6. **Don't** skip validation - always validate with Zod schemas
7. **Don't** use `any` type - use proper TypeScript types
8. **Don't** forget to add `.openapi()` to schemas
9. **Don't** use console.log - use proper logging
10. **Don't** skip error handling - always handle potential errors

## Key Enums and Constants

```typescript
// Status codes
HttpStatusCode.OK = 200
HttpStatusCode.CREATED = 201
HttpStatusCode.BAD_REQUEST = 400
HttpStatusCode.UNAUTHORIZED = 401
HttpStatusCode.NOT_FOUND = 404
HttpStatusCode.INTERNAL_SERVER_ERROR = 500

// Error messages
ErrorMessage.USER_NOT_FOUND = 'User not found'
ErrorMessage.SCHEMA_VALIDATION_FAILED = 'Schema validation failed'
```

## Database Context Access
```typescript
// In controllers, access database via:
req.context.db.entity.methodName()
```

## Commit Message Format

Follow the conventional commit format with custom scope requirements:

```bash
type(scope): subject
```

### Allowed Types
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `chore`: Maintenance tasks
- `test`: Adding or updating tests
- `docs`: Documentation changes

### Required Scopes
- `backend`: Backend-specific changes
- `frontend`: Frontend-specific changes
- `global`: Changes affecting both or project-wide

### Examples
```bash
feat(backend): add user profile endpoint
fix(frontend): resolve authentication redirect issue
refactor(global): update error handling patterns
docs(backend): add API documentation
test(backend): add user repository tests
chore(global): update dependencies
```

### Rules
- Scope is **required** (cannot be empty)
- Subject should be brief and descriptive
- Use imperative mood ("add" not "added")

This context ensures all generated code follows your established patterns and conventions.
