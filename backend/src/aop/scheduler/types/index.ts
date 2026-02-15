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
    cronExpression: string | undefined;
    startDate: Date;
    endDate: Date | null;
    cronTask: ScheduledTask | undefined;
    metadata: {
        startTimeoutId: NodeJS.Timeout | undefined;
        stopTimeoutId: NodeJS.Timeout | undefined;
    };
}

interface CronJobWithId extends CronJob {
    id: string;
}

interface NextAndPreviousRunPayload {
    nextRun: Date | null;
    previousRun: Date | null;
}

export type { CronJob, CronJobWithId, SchedulePayload, FormatCronExpressionPayload, NextAndPreviousRunPayload };
