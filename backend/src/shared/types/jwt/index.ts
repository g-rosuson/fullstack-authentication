import { z } from 'zod';

import { jwtPayloadSchema } from 'shared/schemas/jwt';

type JwtPayload = z.infer<typeof jwtPayloadSchema>;

export type { JwtPayload };
