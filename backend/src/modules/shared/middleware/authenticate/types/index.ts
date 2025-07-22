import type { z } from 'zod';

import { jwtInputSchema } from '../schemas';

export type JWTInput = z.infer<typeof jwtInputSchema>;
