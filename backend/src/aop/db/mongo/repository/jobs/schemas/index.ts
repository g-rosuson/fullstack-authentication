import { ObjectId } from 'mongodb';
import { z } from 'zod';

import { cronJobTypeSchema, toolSchema } from 'shared/schemas/jobs';

/**
 * A job document schema.
 */
const jobDocumentSchema = z
    .object({
        _id: z.instanceof(ObjectId),
        name: z.string(),
        tools: z.array(toolSchema).min(1),
        schedule: z
            .object({
                type: cronJobTypeSchema,
                startDate: z.coerce.date(),
                endDate: z.coerce.date().nullable(),
                nextRun: z.coerce.date(),
                lastRun: z.coerce.date().nullable(),
            })
            .nullable(),
        createdAt: z.coerce.date(),
        updatedAt: z.coerce.date().nullable(),
    })
    .openapi('JobDocument');

export { jobDocumentSchema };
