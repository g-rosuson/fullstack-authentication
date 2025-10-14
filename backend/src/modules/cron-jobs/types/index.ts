import { z } from 'zod';

import { cronJobPayloadSchema, cronJobTypeSchema } from '../schemas';

type CronJobPayload = z.infer<typeof cronJobPayloadSchema>;
type CronJobType = z.infer<typeof cronJobTypeSchema>;

export type { CronJobPayload, CronJobType };
