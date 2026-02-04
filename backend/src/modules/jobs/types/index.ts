import { z } from 'zod';

import { createJobPayloadSchema, idRouteParamSchema, updateJobPayloadSchema } from '../schemas';

type CreateJobPayload = z.infer<typeof createJobPayloadSchema>;
type UpdateJobPayload = z.infer<typeof updateJobPayloadSchema>;
type IdRouteParam = z.infer<typeof idRouteParamSchema>;

export type { CreateJobPayload, IdRouteParam, UpdateJobPayload };
