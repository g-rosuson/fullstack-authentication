import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

import config from 'modules/auth/auth.config';
import { loginUserPayloadSchema, registerUserPayloadSchema } from 'modules/auth/schemas';

import { jwtPayloadSchema } from 'shared/schemas/jwt';

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
                    schema: jwtPayloadSchema,
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
                    schema: jwtPayloadSchema,
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
                    schema: jwtPayloadSchema,
                },
            },
        },
    },
});

export default registry;
