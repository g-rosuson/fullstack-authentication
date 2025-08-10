import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { passwordSchema } from 'modules/auth/schemas';

extendZodWithOpenApi(z);

// Register schema
const registerUserPayloadSchema = z
    .object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().email(),
        password: passwordSchema,
        confirmationPassword: passwordSchema,
    })
    // Check if passwords match
    .refine(data => data.password === data.confirmationPassword, {
        path: ['confirmationPassword'],
        message: 'Passwords do not match',
    })
    .openapi('RegisterUserPayload');

export { registerUserPayloadSchema };
