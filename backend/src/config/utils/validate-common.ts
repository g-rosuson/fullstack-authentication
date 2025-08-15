import { SchemaValidationException } from 'aop/exceptions';
import { parseSchema } from 'lib/validation';

import { ErrorMessage } from 'shared/enums/error-messages';

import {
    accessTokenSecretSchema,
    baseRoutePathSchema,
    mongoDbNameSchema,
    mongoUriSchema,
    refreshTokenSecretSchema,
} from '../schemas';

/**
 * Validates common environment variables required for all environments.
 *
 * Validates:
 * - ACCESS_TOKEN_SECRET (required, non-empty string)
 * - REFRESH_TOKEN_SECRET (required, non-empty string)
 * - MONGO_URI (required, valid URL)
 * - MONGO_DB_NAME (required, non-empty string)
 * - BASE_ROUTE_PATH (required, non-empty string)
 *
 * @returns Validated common configuration
 * @throws SchemaValidationException if validation fails
 */
export const validateCommonEnvironmentVariables = () => {
    const accessTokenSecretResult = parseSchema(accessTokenSecretSchema, process.env.ACCESS_TOKEN_SECRET);

    if (!accessTokenSecretResult.success) {
        throw new SchemaValidationException(ErrorMessage.SCHEMA_VALIDATION_FAILED, {
            issues: accessTokenSecretResult.issues,
        });
    }

    const refreshTokenSecretResult = parseSchema(refreshTokenSecretSchema, process.env.REFRESH_TOKEN_SECRET);

    if (!refreshTokenSecretResult.success) {
        throw new SchemaValidationException(ErrorMessage.SCHEMA_VALIDATION_FAILED, {
            issues: refreshTokenSecretResult.issues,
        });
    }

    const mongoUriResult = parseSchema(mongoUriSchema, process.env.MONGO_URI);

    if (!mongoUriResult.success) {
        throw new SchemaValidationException(ErrorMessage.SCHEMA_VALIDATION_FAILED, {
            issues: mongoUriResult.issues,
        });
    }

    const mongoDbNameResult = parseSchema(mongoDbNameSchema, process.env.MONGO_DB_NAME);

    if (!mongoDbNameResult.success) {
        throw new SchemaValidationException(ErrorMessage.SCHEMA_VALIDATION_FAILED, {
            issues: mongoDbNameResult.issues,
        });
    }

    const baseRoutePathResult = parseSchema(baseRoutePathSchema, process.env.BASE_ROUTE_PATH);

    if (!baseRoutePathResult.success) {
        throw new SchemaValidationException(ErrorMessage.SCHEMA_VALIDATION_FAILED, {
            issues: baseRoutePathResult.issues,
        });
    }

    return {
        accessTokenSecret: accessTokenSecretResult.data,
        refreshTokenSecret: refreshTokenSecretResult.data,
        mongoURI: mongoUriResult.data,
        mongoDBName: mongoDbNameResult.data,
        basePath: baseRoutePathResult.data,
    };
};
