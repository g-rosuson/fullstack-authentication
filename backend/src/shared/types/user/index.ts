import { z } from 'zod';

import { registerUserPayloadSchema } from 'modules/auth/schemas';

type RegisterUserPayload = z.infer<typeof registerUserPayloadSchema>;

export type { RegisterUserPayload };
