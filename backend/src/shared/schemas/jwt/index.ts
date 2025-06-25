import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

const jwtPayloadSchema = z
    .object({
        email: z.string().email(),
        id: z.string(),
    })
    .openapi('JWTPayload');

export { jwtPayloadSchema };
