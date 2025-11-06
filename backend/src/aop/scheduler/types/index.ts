import { ScheduledTask } from 'node-cron';
import { z } from 'zod';

import { cronJobDocumentSchema } from 'shared/schemas/db/documents/cron-job';

type __CronJobDocument = z.infer<typeof cronJobDocumentSchema>;
type __PickedCronJobDocument = Pick<__CronJobDocument, 'name' | 'time' | 'type' | 'startDate' | 'endDate'>;

type ScheduleCronJobPayload = __PickedCronJobDocument & { id: string } & { taskFn: () => Promise<void> };
type FormatCronExpressionPayload = Pick<__CronJobDocument, 'startDate' | 'type'>;

interface CronJob {
    cronTask: ScheduledTask;
    metadata: {
        startTimeoutId: NodeJS.Timeout | undefined;
        stopTimeoutId: NodeJS.Timeout | undefined;
    };
}

export type { CronJob, ScheduleCronJobPayload, FormatCronExpressionPayload };
