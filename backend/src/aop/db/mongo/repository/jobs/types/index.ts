import { z } from 'zod';

import { jobDocumentSchema } from '../schemas';
import { scheduleSchema, scraperToolSchema } from 'shared/schemas/jobs';

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
    userId: string;
    name: string;
    schedule: z.infer<typeof scheduleSchema> | null;
    tools: Tool[];
    createdAt: Date;
}

/**
 * A update job payload schema.
 */
interface UpdateJobPayload {
    id: string;
    userId: string;
    name?: string;
    schedule: z.infer<typeof scheduleSchema> | null;
    tools: Tool[];
    updatedAt: Date;
}

/**
 * A job document schema.
 */
type JobDocument = z.infer<typeof jobDocumentSchema>;

export type { CreateJobPayload, UpdateJobPayload, JobDocument };
