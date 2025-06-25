import { z } from 'zod';

import { loginUserPayloadSchema } from '../schemas';

type LoginUserPayload = z.infer<typeof loginUserPayloadSchema>;

export type { LoginUserPayload };
