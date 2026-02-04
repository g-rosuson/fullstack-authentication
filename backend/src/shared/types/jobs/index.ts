import type { ToolWithTargetResults } from 'aop/delegator/tools/types';

/**
 * A cron job type.
 * @note Used in job db repository, delegator, scheduler and jobs module.
 */
type CronJobType = 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly';

/**
 * A execution payload.
 * @note Used in job db repository and delegator.
 */
interface ExecutionPayload {
    jobId: string;
    schedule: {
        type: CronJobType | null;
        delegatedAt: Date;
        finishedAt: Date | null;
    };
    tools: ToolWithTargetResults[];
}

export type { CronJobType, ExecutionPayload };
