# AI Context - Backend Code Generation Guide

## Project Overview
- **Framework**: Node.js + Express + TypeScript
- **Database**: MongoDB with Repository pattern
- **Validation**: Zod schemas with OpenAPI generation
- **Architecture**: AOP (Aspect-Oriented Programming) with feature modules
- **Error Handling**: Custom exception hierarchy with BaseException

## Code Generation Rules

### File Organization Rules
```
src/
├── aop/                   # Cross-cutting concerns
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
├── services/             # Business logic
├── shared/               # Enums, types, constants
└── config/               # Configuration
    ├── schemas/
    │   └── index.ts
    ├── types/
    │   └── index.ts
    └── index.ts
```

**Folder structure rule**: Only schemas, types, constants, utils, helpers, mappers should be in folders with index.ts. Controllers, middleware, and routing files can be standalone.

### Controller Generation Rules
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

### Schema Generation Rules
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

**Schema Validation:**
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

**OpenAPI Registry:**
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

### Type Definition Rules
**Always separate types from schemas in different files:**

```typescript
// types/index.ts - Only type definitions
import { z } from 'zod';
import { payloadSchema } from '../schemas';

type PayloadType = z.infer<typeof payloadSchema>;

export type { PayloadType };
```

**Rule**: Types should only contain `z.infer<>` statements and type exports. No schema definitions.

### Repository Generation Rules
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

### Error Handling Rules
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

### Route Definition Rules
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

### Constants Rules
```typescript
export const ROUTE_PATH = '/feature';
export const COLLECTION_NAME = 'features';
```

### Response Format Rules
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



## Testing Rules

### What to Test
- **Service contracts**: Does it return what it promises?
- **Business logic**: Does it behave correctly?
- **Integration**: Does it work with real dependencies?

### What NOT to Test  
- **Third-party libraries**: Not your responsibility
- **Configuration values**: Already validated by config modules
- **Implementation details**: Test WHAT it does, not HOW
- **Redundant scenarios**: If it works for one input, it works for all

**Coverage target**: 80-90% backend, focus on critical paths, not over-engineering.

**Note**: Vitest is configured with `globals: true`, so `describe`, `it`, `expect` are available globally - no need to import them.

### Test Code Organization
When writing tests, extract shared values into variables within each test block. Use the same variable names across schema definitions, test data, and expected results. This ensures consistency and maintainability.

**Example**:
```typescript
it('should validate user data', () => {
    const nameProperty = 'name';
    const emailProperty = 'email';
    const nameValue = 'John';
    const emailValue = 'john@example.com';

    const schema = z.object({
        [nameProperty]: z.string(),
        [emailProperty]: z.string().email(),
    });

    const result = parseSchema(schema, {
        [nameProperty]: nameValue,
        [emailProperty]: emailValue,
    });

    expect(result).toEqual({
        success: true,
        data: { [nameProperty]: nameValue, [emailProperty]: emailValue },
    });
});
```

## Workflow Rules

**After file creation/modification:**
- Run linter to auto-sort imports and fix formatting

### Commit Message Rules
Follow the conventional commit format with custom scope requirements:

```bash
type(scope): subject
```

**Allowed Types**: `feat`, `fix`, `refactor`, `chore`, `test`, `docs`
**Required Scopes**: `backend`, `frontend`, `global`
**Rules**: Scope required, subject under 72 chars, imperative mood, focus on what change accomplishes

### Branch Naming Rules
Follow the format: `[scope]/[action]-[description]`

**Allowed Scopes**: `backend`, `frontend`, `global`, `docs`, `test`, `chore`
**Rules**: Use kebab-case, be descriptive but concise, action should be a verb

## Reference Data

### Key Enums and Constants

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

### Anti-Patterns to Avoid
- **Don't** use `interface` - prefer `type` for simple type aliases
- **Don't** use double quotes - always use single quotes
- **Don't** skip JSDoc comments for public functions
- **Don't** use generic error messages - use specific ErrorMessage enum
- **Don't** access database directly - always use repository pattern
- **Don't** skip validation - always validate with Zod schemas using `parseSchema`
- **Don't** use `any` type - use proper TypeScript types
- **Don't** forget to create OpenAPI registry and add to generate-spec.ts
- **Don't** use console.log - use proper logging
- **Don't** skip error handling - always handle potential errors
- **Don't** put schemas and types in the same file - always separate them
- **Don't** create single files outside folders - use `folder/index.ts` structure for schemas, types, constants, utils, helpers, mappers
- **Don't** use dynamic imports - use regular imports instead of `await import('./module')`
- **Don't** have code lines without spacing - add at least one empty line between code blocks
- **Don't** manually call `process.exit()` for validation errors - let them bubble up to be handled by exception middleware

This context ensures all generated code follows your established patterns and conventions.
