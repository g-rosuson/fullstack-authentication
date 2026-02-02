import { ObjectId } from 'mongodb';
import { z } from 'zod';

import { executionSchema, scheduleSchema, toolSchema } from 'shared/schemas/jobs';

/**
 * A job document schema.
 */
const jobDocumentSchema = z
    .object({
        _id: z.instanceof(ObjectId),
        name: z.string(),
        tools: z.array(toolSchema).min(1),
        schedule: scheduleSchema.nullable(),
        createdAt: z.coerce.date(),
        updatedAt: z.coerce.date().nullable(),
        executions: z.array(executionSchema).optional(),
    })
    .openapi('JobDocument');

export { jobDocumentSchema };
