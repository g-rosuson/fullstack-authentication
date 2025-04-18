import { z } from 'zod';

// Login & register
const authentication = z.object({
    password: z.string().min(8),
    email: z.string().email(),
});

type AuthenticationPayload = z.infer<typeof authentication>;

export type { AuthenticationPayload };

const schema = {
    authentication,
};

export default schema;
