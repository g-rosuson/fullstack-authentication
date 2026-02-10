import { ScheduledTask } from 'node-cron';

import { CronJobType } from 'shared/types/jobs';

interface FormatCronExpressionPayload {
    startDate: Date;
    type: Exclude<CronJobType, 'once'>;
}

interface SchedulePayload {
    jobId: string;
    name: string;
    type: CronJobType;
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
