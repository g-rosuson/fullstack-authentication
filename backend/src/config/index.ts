import dotenv from 'dotenv';

dotenv.config();

import { SchemaValidationException } from 'aop/exceptions';
import { parseSchema } from 'lib/validation';

import { ErrorMessage } from 'shared/enums/error-messages';

import {
    accessTokenSecretSchema,
    baseRoutePathSchema,
    devClientUrlSchema,
    devDomainSchema,
    mongoDbNameSchema,
    mongoUriSchema,
    nodeEnvSchema,
    prodClientUrlSchema,
    prodDomainSchema,
    refreshTokenSecretSchema,
} from './schemas';

/**
 * Validates all required environment variables and returns validated configuration.
 * Throws SchemaValidationException if any required environment variable is missing or invalid.
 *
 * Validates:
 * - NODE_ENV (must be 'development' or 'production')
 * - Environment-specific variables based on NODE_ENV:
 *   - Development: DEV_CLIENT_URL, DEV_DOMAIN
 *   - Production: PROD_CLIENT_URL, PROD_DOMAIN
 *
 * @returns Validated environment configuration
 * @throws SchemaValidationException if validation fails
 */
const validateEnvironmentVariables = () => {
    // Validate NODE_ENV
    const nodeEnvResult = parseSchema(nodeEnvSchema, process.env.NODE_ENV);

    if (!nodeEnvResult.success) {
        throw new SchemaValidationException(ErrorMessage.SCHEMA_VALIDATION_FAILED, {
            issues: nodeEnvResult.issues,
        });
    }

    const isDeveloping = nodeEnvResult.data === 'development';

    // Validate environment-specific variables
    if (isDeveloping) {
        const devClientUrlResult = parseSchema(devClientUrlSchema, process.env.DEV_CLIENT_URL);

        if (!devClientUrlResult.success) {
            throw new SchemaValidationException(ErrorMessage.SCHEMA_VALIDATION_FAILED, {
                issues: devClientUrlResult.issues,
            });
        }

        const devDomainResult = parseSchema(devDomainSchema, process.env.DEV_DOMAIN);

        if (!devDomainResult.success) {
            throw new SchemaValidationException(ErrorMessage.SCHEMA_VALIDATION_FAILED, {
                issues: devDomainResult.issues,
            });
        }

        return {
            isDeveloping,
            clientUrl: devClientUrlResult.data,
            domain: devDomainResult.data,
        };
    } else {
        const prodClientUrlResult = parseSchema(prodClientUrlSchema, process.env.PROD_CLIENT_URL);

        if (!prodClientUrlResult.success) {
            throw new SchemaValidationException(ErrorMessage.SCHEMA_VALIDATION_FAILED, {
                issues: prodClientUrlResult.issues,
            });
        }

        const prodDomainResult = parseSchema(prodDomainSchema, process.env.PROD_DOMAIN);

        if (!prodDomainResult.success) {
            throw new SchemaValidationException(ErrorMessage.SCHEMA_VALIDATION_FAILED, {
                issues: prodDomainResult.issues,
            });
        }

        return {
            isDeveloping,
            clientUrl: prodClientUrlResult.data,
            domain: prodDomainResult.data,
        };
    }
};

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
const validateCommonEnvironmentVariables = () => {
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

// Validate environment variables at module initialization (fail-fast)
const envConfig = validateEnvironmentVariables();
const commonConfig = validateCommonEnvironmentVariables();

const config = {
    ...envConfig,
    ...commonConfig,
};

export default config;
