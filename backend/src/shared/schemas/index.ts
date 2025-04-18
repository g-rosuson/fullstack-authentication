import { z } from 'zod';

const jwt = z.object({
    email: z.string().email(),
    id: z.string().uuid(),
});

type JWTPayload = z.infer<typeof jwt>;

export type { JWTPayload };

const schema = {
    jwt,
};

export default schema;
