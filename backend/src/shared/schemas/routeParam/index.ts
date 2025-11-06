import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

const idRouteParamSchema = z
    .object({
        id: z.string(),
    })
    .openapi('IdRouteParam');

const paginatedRouteParamSchema = z
    .object({
        limit: z.string().optional(),
        offset: z.string().optional(),
    })
    .openapi('PaginatedRouteParam');

export { idRouteParamSchema, paginatedRouteParamSchema };
