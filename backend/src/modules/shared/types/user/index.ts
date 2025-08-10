import { z } from 'zod';

import { registerUserPayloadSchema } from '../../schemas/user';

type RegisterUserPayload = z.infer<typeof registerUserPayloadSchema>;
type CreateUserPayload = Omit<RegisterUserPayload, 'confirmationPassword'>;

export type { RegisterUserPayload, CreateUserPayload };
