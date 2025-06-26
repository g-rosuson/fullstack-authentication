import { z } from 'zod';

import { jwtPayloadSchema, loginUserPayloadSchema } from '../schemas';

type JwtPayload = z.infer<typeof jwtPayloadSchema>;
type LoginUserPayload = z.infer<typeof loginUserPayloadSchema>;

export type { JwtPayload, LoginUserPayload };
