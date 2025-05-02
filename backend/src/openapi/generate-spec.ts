import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';

import authRegistry from 'modules/auth/auth.docs';

// Determine registries for all relevant modules
const registries = [...authRegistry.definitions];

// Determine generator & generate document
const generator = new OpenApiGeneratorV3(registries);

export const openApiDocument = generator.generateDocument({
    openapi: '3.0.0',
    info: {
        title: 'Openapi documentation',
        version: '1.0.0',
    },
});
