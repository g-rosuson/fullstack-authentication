import { z } from 'zod';

export const jwtInputSchema = z.object({
    email: z.string().email(),
    id: z.string(),
});
