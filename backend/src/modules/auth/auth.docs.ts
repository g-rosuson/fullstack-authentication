import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

import config from './auth.config';

import authOutputDtoSchema from 'modules/auth/dto/output';
import authInputDtoSchema from 'modules/auth/dto/input';

// Determine registry
const registry = new OpenAPIRegistry();

// Register schemas
registry.register('RegisterInputDto', authInputDtoSchema.registerInputDto);
registry.register('LoginInputDto', authInputDtoSchema.loginInputDto);

registry.register('AuthenticationOutputDto', authOutputDtoSchema.authenticationOutputDto);
registry.register('LogoutOutputDto', authOutputDtoSchema.logoutOutputDto);

// Register paths
registry.registerPath({
    method: 'post',
    path: config.route.login,
    responses: {
        200: {
            description: 'Authentication payload when login is successful',
            content: {
                'application/json': {
                    schema: authOutputDtoSchema.authenticationOutputDto,
                },
            },
        },
    },
    request: {
        body: {
            description: 'Login payload',
            content: {
                'application/json': {
                    schema: authInputDtoSchema.loginInputDto,
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
                    schema: authOutputDtoSchema.authenticationOutputDto,
                },
            },
        },
    },
    request: {
        body: {
            description: 'Register payload',
            content: {
                'application/json': {
                    schema: authInputDtoSchema.registerInputDto,
                },
            },
        },
    },
});

registry.registerPath({
    method: 'post',
    path: config.route.logout,
    responses: {
        200: {
            description: 'Payload after a successful logout',
            content: {
                'application/json': {
                    schema: authOutputDtoSchema.authenticationOutputDto,
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
                    schema: authOutputDtoSchema.authenticationOutputDto,
                },
            },
        },
    },
});

export default registry;
