import { z } from 'zod';

import { cronJobPayloadSchema } from '../schemas';
import { cronJobTypeSchema } from 'shared/schemas/db/documents/cron-job';

type CronJobPayload = z.infer<typeof cronJobPayloadSchema>;
type CronJobType = z.infer<typeof cronJobTypeSchema>;

export type { CronJobPayload, CronJobType };
