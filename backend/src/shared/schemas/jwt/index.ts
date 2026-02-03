import { z } from 'zod';

/**
 * A JWT payload schema.
 */
const jwtPayloadSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    id: z.string(),
});

export { jwtPayloadSchema };
