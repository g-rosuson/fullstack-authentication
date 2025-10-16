import { z } from 'zod';

import { jwtPayloadSchema, loginUserPayloadSchema, registerUserPayloadSchema } from '../schemas';

type JwtPayload = z.infer<typeof jwtPayloadSchema>;
type LoginUserPayload = z.infer<typeof loginUserPayloadSchema>;
type RegisterUserPayload = z.infer<typeof registerUserPayloadSchema>;
type CreateUserPayload = Omit<RegisterUserPayload, 'confirmationPassword'>;

export type { JwtPayload, LoginUserPayload, RegisterUserPayload, CreateUserPayload };
