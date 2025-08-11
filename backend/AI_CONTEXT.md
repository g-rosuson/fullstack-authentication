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
│   │   ├── constants/     # Folder with index.ts
│   │   │   └── index.ts
│   │   ├── schemas/       # Folder with index.ts
│   │   │   └── index.ts
│   │   ├── types/         # Folder with index.ts
│   │   │   └── index.ts
│   │   ├── utils/         # Folder with index.ts
│   │   │   └── index.ts
│   │   ├── feature-controller.ts    # Standalone file
│   │   ├── feature-middleware.ts    # Standalone file
│   │   └── feature-routing.ts       # Standalone file
├── services/              # Business logic
├── shared/               # Enums, types, constants
└── config/               # Configuration
    ├── schemas/
    │   └── index.ts
    ├── types/
    │   └── index.ts
    └── index.ts
```

**Folder structure rule**: Only schemas, types, constants, utils, helpers, mappers should be in folders with index.ts. Controllers, middleware, and routing files can be standalone.

### 2. Import Order (ESLint Rule)
**Always follow the import order defined in `backend/.eslintrc.json`**

The current import order is configured in the ESLint `simple-import-sort` rule. Check the `.eslintrc.json` file for the exact order and grouping rules.

Example of proper import organization:
```typescript
// External packages first
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';

// Then module imports, AOP imports, config, etc.
// (exact order defined in ESLint config)
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

// For API endpoints (exposed to client) - add .openapi()
const payloadSchema = z
    .object({
        field1: z.string(),
        field2: z.string().email(),
    })
    .openapi('PayloadType');

// For internal validation (not exposed to client) - no .openapi()
const internalSchema = z
    .object({
        internalField: z.string(),
    });
```

**Rule**: Only add `.openapi()` to schemas that are exposed to the client via API endpoints. Internal schemas (config, validation, etc.) should not have `.openapi()` decorators.

### 4.1 Schema Validation (Always use parseSchema)
**Always use the `parseSchema` function from `lib/validation` for schema validation:**

```typescript
import { parseSchema } from 'lib/validation';
import { documentSchema } from './schemas';

const result = parseSchema(documentSchema, unknownData);

if (!result.success) {
    throw new SchemaValidationException(ErrorMessage.SCHEMA_VALIDATION_FAILED, { issues: result.issues });
}

return result.data; // Type-safe validated data
```

The `parseSchema` function takes `data: unknown` and returns `SchemaResult<T>` which provides:
- `{ success: true, data: T }` for valid data
- `{ success: false, issues: ValidationIssue[] }` for validation errors with mapped error structure

### 4.2 OpenAPI Registry (Required for API Documentation)
To expose schemas in the OpenAPI documentation, you must:

1. **Create a registry file**: `backend/src/services/openapi/registries/feature-registry.ts`
2. **Register paths and schemas** in the registry
3. **Add registry to generate-spec.ts**

```typescript
// backend/src/services/openapi/registries/feature-registry.ts
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { FEATURE_ROUTE } from 'modules/feature/constants';
import { featurePayloadSchema, featureResponseSchema } from 'modules/feature/schemas';

const registry = new OpenAPIRegistry();

registry.registerPath({
    method: 'post',
    path: FEATURE_ROUTE,
    responses: {
        200: {
            description: 'Feature operation successful',
            content: {
                'application/json': {
                    schema: featureResponseSchema,
                },
            },
        },
    },
    request: {
        body: {
            description: 'Feature payload',
            content: {
                'application/json': {
                    schema: featurePayloadSchema,
                },
            },
        },
    },
});

export default registry;
```

```typescript
// Update backend/src/services/openapi/generate-spec.ts
import featureRegistry from './registries/feature-registry';

const registries = [...authRegistry.definitions, ...featureRegistry.definitions];
```

### 5. Type Definition
**Always separate types from schemas in different files:**

```typescript
// types/index.ts - Only type definitions
import { z } from 'zod';
import { payloadSchema } from '../schemas';

type PayloadType = z.infer<typeof payloadSchema>;

export type { PayloadType };
```

```typescript
// schemas/index.ts - Only Zod schemas with .openapi() decorators
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

const payloadSchema = z
    .object({
        field1: z.string(),
        field2: z.string().email(),
    })
    .openapi('PayloadType');

export { payloadSchema };
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
    data: responseData, // Type is inferred from the actual data
    meta: { timestamp: number }
}
```

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

### OpenAPI Registry Template
```typescript
// backend/src/services/openapi/registries/feature-registry.ts
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { FEATURE_ROUTE } from 'modules/feature/constants';
import { featurePayloadSchema, featureResponseSchema } from 'modules/feature/schemas';

const registry = new OpenAPIRegistry();

registry.registerPath({
    method: 'post',
    path: FEATURE_ROUTE,
    responses: {
        200: {
            description: 'Feature operation successful',
            content: {
                'application/json': {
                    schema: featureResponseSchema,
                },
            },
        },
    },
    request: {
        body: {
            description: 'Feature payload',
            content: {
                'application/json': {
                    schema: featurePayloadSchema,
                },
            },
        },
    },
});

export default registry;
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
6. **Don't** skip validation - always validate with Zod schemas using `parseSchema`
7. **Don't** use `any` type - use proper TypeScript types
8. **Don't** forget to add `.openapi()` to schemas that are exposed to the client (API endpoints)
9. **Don't** forget to create OpenAPI registry and add to generate-spec.ts
10. **Don't** use console.log - use proper logging
11. **Don't** skip error handling - always handle potential errors
12. **Don't** put schemas and types in the same file - always separate them
13. **Don't** create single files outside folders - use `folder/index.ts` structure for schemas, types, constants, utils, helpers, mappers
14. **Don't** add `.openapi()` to internal schemas - only add to schemas that are exposed to the client via API endpoints
15. **Don't** use dynamic imports - use regular imports instead of `await import('./module')`
16. **Don't** have code lines without spacing - add at least one empty line between code blocks
17. **Don't** manually call `process.exit()` for validation errors - let them bubble up to be handled by exception middleware

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

## Error Handling Patterns
- **Internal Error Flow**: All errors are automatically logged and responded to the client through the exception middleware
- **Environment Validation**: Throw `SchemaValidationException` for invalid environment variables - this will crash the server after logging and client notification
- **Fail-Fast Structure**: Due to the application structure, environment errors bubble up through the call stack, get logged/responded by middleware, then crash the server

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
- Subject should be brief and descriptive (under 72 characters)
- Use imperative mood ("add" not "added")
- Focus on what the change accomplishes
- Avoid technical implementation details in subject

## Branch Naming Convention

Follow the format: `[scope]/[action]-[description]`

### Allowed Scopes
- `backend`: Backend-specific changes
- `frontend`: Frontend-specific changes
- `global`: Changes affecting both or project-wide
- `docs`: Documentation changes
- `test`: Testing-related changes
- `chore`: Maintenance tasks

### Examples
```bash
backend/resolve-circular-dependency
frontend/create-auth-component
global/update-dependencies
docs/add-api-documentation
test/add-user-repository-tests
chore/update-eslint-config
```

### Rules
- Use kebab-case for description
- Be descriptive but concise
- Action should be a verb (create, fix, resolve, update, etc.)

## Testing Strategy

### ✅ Test This
- **Service contracts**: Does it return what it promises?
- **Business logic**: Does it behave correctly?
- **Integration**: Does it work with real dependencies?

### ❌ Don't Test This  
- **Third-party libraries**: Not your responsibility
- **Configuration values**: Already validated by config modules
- **Implementation details**: Test WHAT it does, not HOW
- **Redundant scenarios**: If it works for one input, it works for all

**Coverage target**: 80-90% backend, focus on critical paths, not over-engineering.

**Note**: Vitest is configured with `globals: true`, so `describe`, `it`, `expect` are available globally - no need to import them.

This context ensures all generated code follows your established patterns and conventions.
