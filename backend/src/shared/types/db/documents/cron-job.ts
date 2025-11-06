import { z } from 'zod';

import { cronJobDocumentSchema, cronJobTypeSchema } from 'shared/schemas/db/documents/cron-job';

type CronJobDocument = z.infer<typeof cronJobDocumentSchema>;
type CronJobType = z.infer<typeof cronJobTypeSchema>;

export type { CronJobDocument, CronJobType };
