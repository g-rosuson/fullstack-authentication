import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

extendZodWithOpenApi(z);

const cronJobTypeSchema = z.enum(['daily', 'weekly', 'monthly', 'yearly']);

const cronJobDocumentSchema = z
    .object({
        _id: z.instanceof(ObjectId),
        name: z.string(),
        time: z.date(),
        type: cronJobTypeSchema,
        startDate: z.date(),
        endDate: z.date().nullable(),
        lastRun: z.date().nullable(),
        nextRun: z.date(),
        createdAt: z.date(),
        updatedAt: z.date().nullable(),
        isActive: z.boolean(),
    })
    .openapi('CronJobDocument');

export { cronJobDocumentSchema, cronJobTypeSchema };
