import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { EnvErrorMessage } from 'shared/enums/error-messages';

extendZodWithOpenApi(z);

// Environment variable schemas
const nodeEnvSchema = z.enum(['development', 'production']);

const devClientUrlSchema = z.string().url();

const prodClientUrlSchema = z.string().url();

const devDomainSchema = z.string();

const prodDomainSchema = z.string();

const accessTokenSecretSchema = z.string().min(1, EnvErrorMessage.ACCESS_TOKEN_SECRET_REQUIRED);

const refreshTokenSecretSchema = z.string().min(1, EnvErrorMessage.REFRESH_TOKEN_SECRET_REQUIRED);

const mongoUriSchema = z.string().url(EnvErrorMessage.MONGO_URI_INVALID);

const mongoDbNameSchema = z.string().min(1, EnvErrorMessage.MONGO_DB_NAME_REQUIRED);

const baseRoutePathSchema = z.string().min(1, EnvErrorMessage.BASE_ROUTE_PATH_REQUIRED);

export {
    nodeEnvSchema,
    devClientUrlSchema,
    prodClientUrlSchema,
    devDomainSchema,
    prodDomainSchema,
    accessTokenSecretSchema,
    refreshTokenSecretSchema,
    mongoUriSchema,
    mongoDbNameSchema,
    baseRoutePathSchema,
};
