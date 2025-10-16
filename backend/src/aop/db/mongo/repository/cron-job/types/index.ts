import { z } from 'zod';

import { cronJobDocumentSchema } from 'shared/schemas/db/documents/cron-job';

type __CronJobDocument = z.infer<typeof cronJobDocumentSchema>;

type __PickedCronJobDocument = Pick<
    __CronJobDocument,
    'name' | 'time' | 'type' | 'startDate' | 'endDate' | 'nextRun' | 'updatedAt' | 'isActive'
>;
type UpdateCronJobPayload = __PickedCronJobDocument & { id: string };

type __PickedCreateCronJobPayload = Pick<
    __CronJobDocument,
    'name' | 'time' | 'type' | 'startDate' | 'endDate' | 'nextRun' | 'createdAt' | 'isActive'
>;
type CreateCronJobPayload = __PickedCreateCronJobPayload & { createdAt: Date };

export type { UpdateCronJobPayload, CreateCronJobPayload };
