import { z } from 'zod';

import { loginUserPayloadSchema, registerUserPayloadSchema } from '../schemas';

type LoginUserPayload = z.infer<typeof loginUserPayloadSchema>;
type RegisterUserPayload = z.infer<typeof registerUserPayloadSchema>;
type CreateUserPayload = Omit<RegisterUserPayload, 'confirmationPassword'>;

export type { LoginUserPayload, RegisterUserPayload, CreateUserPayload };
