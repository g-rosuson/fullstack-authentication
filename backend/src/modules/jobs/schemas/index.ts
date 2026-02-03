import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { validateJobSchedule } from './schemas-validators';
import { scheduleSchema, targetSchema } from 'shared/schemas/jobs';

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
    keywords: z.array(z.string()).min(1),
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
 * A job payload schema for updating a job.
 */
const updateJobPayloadSchema = z
    .object({
        name: z.string(),
        timestamp: z.coerce.date(),
        schedule: scheduleSchema.nullable(),
        tools: z.array(scraperToolPayloadSchema).min(1),
    })
    .superRefine(validateJobSchedule)
    .openapi('UpdateJobPayload');

export { createJobPayloadSchema, updateJobPayloadSchema };
