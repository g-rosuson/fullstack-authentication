import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { validateJobSchedule } from './schemas-validators';
import { resultErrorSchema, scheduleSchema, scraperResultSchema, targetSchema } from 'shared/schemas/jobs';

extendZodWithOpenApi(z);

/**
 * A scraper tool payload schema.
 * @private
 */
const scraperToolPayloadSchema = z.object({
    type: z.literal('scraper'),
    targets: z.array(
        z.object({
            target: targetSchema,
            keywords: z.array(z.string()).min(1).optional(),
            maxPages: z.number().positive().optional(),
            id: z.string().optional(),
        })
    ),
    keywords: z.array(z.string()),
    maxPages: z.number().positive(),
});

/**
 * A job payload schema.
 */
const createJobPayloadSchema = z
    .object({
        name: z.string(),
        timestamp: z.coerce.date(),
        schedule: scheduleSchema.nullable(),
        tools: z.array(scraperToolPayloadSchema).min(1),
    })
    .superRefine(validateJobSchedule)
    .openapi('CreateJobPayload');

/**
 * A scraper tool payload schema for updating a job.
 * @private
 */
const updateScraperToolPayloadSchema = scraperToolPayloadSchema.extend({
    results: z.array(scraperResultSchema).nullable(),
    errors: z.array(resultErrorSchema).nullable(),
});

/**
 * A job payload schema for updating a job.
 */
const updateJobPayloadSchema = z
    .object({
        name: z.string(),
        timestamp: z.coerce.date(),
        schedule: scheduleSchema.nullable(),
        tools: z.array(updateScraperToolPayloadSchema).min(1),
    })
    .superRefine(validateJobSchedule)
    .openapi('UpdateJobPayload');

export { createJobPayloadSchema, updateJobPayloadSchema };
