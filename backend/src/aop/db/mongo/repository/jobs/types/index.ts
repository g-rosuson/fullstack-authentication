import { z } from 'zod';

import { cronJobTypeSchema, scraperToolSchema } from 'shared/schemas/jobs';

/**
 * A scraper tool.
 */
type ScraperTool = z.infer<typeof scraperToolSchema>;

/**
 * A union of all available tool types.
 */
type Tool = ScraperTool;

/**
 * A create job payload schema.
 */
interface CreateJobPayload {
    name: string;
    schedule: {
        type: z.infer<typeof cronJobTypeSchema>;
        startDate: Date;
        endDate: Date | null;
        nextRun: Date;
        lastRun: Date | null;
    } | null;
    tools: Tool[];
    createdAt: Date;
}

/**
 * A update job payload schema.
 */
interface UpdateJobPayload {
    id: string;
    name?: string;
    schedule?: {
        type: z.infer<typeof cronJobTypeSchema>;
        startDate?: Date;
        endDate?: Date | null;
        nextRun?: Date;
        lastRun?: Date | null;
    } | null;
    tools: Tool[];
    updatedAt: Date;
}

export type { CreateJobPayload, UpdateJobPayload };
