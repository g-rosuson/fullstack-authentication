import { z } from 'zod';

import { jwtPayloadSchema } from '../../schemas/jwt';

type JWTPayload = z.infer<typeof jwtPayloadSchema>;

export type { JWTPayload };
