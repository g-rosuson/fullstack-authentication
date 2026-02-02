import { z } from 'zod';

import { createJobPayloadSchema, updateJobPayloadSchema } from '../schemas';
import { cronJobTypeSchema } from 'shared/schemas/jobs';

type CronJobSchedule = z.infer<typeof cronJobTypeSchema>;
type CreateJobPayload = z.infer<typeof createJobPayloadSchema>;
type UpdateJobPayload = z.infer<typeof updateJobPayloadSchema>;

export type { CronJobSchedule, CreateJobPayload, UpdateJobPayload };
