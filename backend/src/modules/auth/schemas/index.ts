import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

// Register
const registerUserPayloadSchema = z
    .object({
        password: z.string().min(8),
        email: z.string().email(),
    })
    .openapi('RegisterUserPayload');

// Login
const loginUserPayloadSchema = z
    .object({
        password: z.string().min(8),
        email: z.string().email(),
    })
    .openapi('LoginUserPayload');

export { registerUserPayloadSchema, loginUserPayloadSchema };
