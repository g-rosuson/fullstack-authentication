import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

import config from 'modules/auth/auth.config';
import { accessTokenSchema, loginUserPayloadSchema, registerUserPayloadSchema } from 'modules/auth/schemas';

// Determine registry
const registry = new OpenAPIRegistry();

// Register paths
registry.registerPath({
    method: 'post',
    path: config.route.login,
    responses: {
        200: {
            description: 'Authentication payload when login is successful',
            content: {
                'application/json': {
                    schema: accessTokenSchema,
                },
            },
        },
    },
    request: {
        body: {
            description: 'Login payload',
            content: {
                'application/json': {
                    schema: loginUserPayloadSchema,
                },
            },
        },
    },
});

registry.registerPath({
    method: 'post',
    path: config.route.register,
    responses: {
        200: {
            description: 'Authentication payload when registration is successful',
            content: {
                'application/json': {
                    schema: accessTokenSchema,
                },
            },
        },
    },
    request: {
        body: {
            description: 'Register payload',
            content: {
                'application/json': {
                    schema: registerUserPayloadSchema,
                },
            },
        },
    },
});

registry.registerPath({
    method: 'get',
    path: config.route.refresh,
    responses: {
        200: {
            description: 'Authentication payload when refreshing access-token is successful',
            content: {
                'application/json': {
                    schema: accessTokenSchema,
                },
            },
        },
    },
});

export default registry;
