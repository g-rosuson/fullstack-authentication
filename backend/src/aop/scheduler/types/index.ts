import { ScheduledTask } from 'node-cron';
import { z } from 'zod';

import { cronJobTypeSchema } from 'shared/schemas/jobs';

interface FormatCronExpressionPayload {
    startDate: Date;
    type: Exclude<z.infer<typeof cronJobTypeSchema>, 'once'>;
}

interface SchedulePayload {
    id: string;
    name: string;
    type: z.infer<typeof cronJobTypeSchema>;
    timestamp: Date;
    startDate: Date;
    endDate: Date | null;
}

interface CronJob {
    endDate: Date | null;
    cronTask: ScheduledTask | undefined;
    metadata: {
        startTimeoutId: NodeJS.Timeout | undefined;
        stopTimeoutId: NodeJS.Timeout | undefined;
    };
}

export type { CronJob, SchedulePayload, FormatCronExpressionPayload };
