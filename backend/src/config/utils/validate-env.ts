import { SchemaValidationException } from 'aop/exceptions';
import { parseSchema } from 'lib/validation';

import { ErrorMessage } from 'shared/enums/error-messages';

import { devClientUrlSchema, devDomainSchema, nodeEnvSchema, prodClientUrlSchema, prodDomainSchema } from '../schemas';

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
export const validateEnvironmentVariables = () => {
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
