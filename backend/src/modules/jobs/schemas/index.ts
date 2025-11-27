import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { validateJobSchedule } from './schemas-validators';
import { cronJobTypeSchema, emailResultSchema, scraperResultSchema, targetErrorSchema } from 'shared/schemas/jobs';

extendZodWithOpenApi(z);

/**
 * An email tool payload schema.
 */
const emailToolPayloadSchema = z.object({
    type: z.literal('email'),
    targets: z.array(
        z.object({
            target: z.string().email(),
            subject: z.string().optional(),
            body: z.string().optional(),
            id: z.string().optional(),
        })
    ),
    subject: z.string(),
    body: z.string(),
});

/**
 * A scraper tool payload schema.
 */
const scraperToolPayloadSchema = z.object({
    type: z.literal('scraper'),
    targets: z.array(
        z.object({
            target: z.string().url(),
            keywords: z.array(z.string()).optional(),
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
        schedule: z
            .object({
                type: cronJobTypeSchema,
                startDate: z.coerce.date(),
                endDate: z.coerce.date().nullable(),
            })
            .nullable(),
        tools: z.array(z.union([scraperToolPayloadSchema, emailToolPayloadSchema])).min(1),
    })
    .superRefine(validateJobSchedule)
    .openapi('CreateJobPayload');

/**
 * A scraper tool payload schema for updating a job.
 */
const updateScraperToolPayloadSchema = scraperToolPayloadSchema.extend({
    results: z.array(scraperResultSchema).nullable(),
    errors: z.array(targetErrorSchema).nullable(),
});

/**
 * A email tool payload schema for updating a job.
 */
const updateEmailToolPayloadSchema = emailToolPayloadSchema.extend({
    results: z.array(emailResultSchema).nullable(),
    errors: z.array(targetErrorSchema).nullable(),
});

/**
 * A job payload schema for updating a job.
 */
const updateJobPayloadSchema = z
    .object({
        name: z.string(),
        timestamp: z.coerce.date(),
        schedule: z
            .object({
                type: cronJobTypeSchema,
                startDate: z.coerce.date(),
                endDate: z.coerce.date().nullable(),
            })
            .nullable(),
        tools: z.array(z.union([updateScraperToolPayloadSchema, updateEmailToolPayloadSchema])).min(1),
    })
    .superRefine(validateJobSchedule)
    .openapi('UpdateJobPayload');

export { createJobPayloadSchema, updateJobPayloadSchema };
