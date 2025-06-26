import { z } from 'zod';

import { registerUserPayloadSchema } from 'modules/auth/schemas';

type RegisterUserPayload = z.infer<typeof registerUserPayloadSchema>;
type CreateUserPayload = Omit<RegisterUserPayload, 'confirmationPassword'>;

export type { RegisterUserPayload, CreateUserPayload };
