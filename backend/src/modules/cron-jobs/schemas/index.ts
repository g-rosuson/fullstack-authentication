import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { ErrorMessage } from 'shared/enums/error-messages';

extendZodWithOpenApi(z);

const cronJobTypeSchema = z.enum(['daily', 'weekly', 'monthly', 'yearly']);

const cronJobPayloadSchema = z
    .object({
        name: z.string(),
        time: z.date(),
        type: cronJobTypeSchema,
        startDate: z.date(),
        endDate: z.date().nullable(),
    })
    .superRefine((payload, ctx) => {
        if (payload.startDate > payload.time) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: ErrorMessage.CRON_JOB_START_DATE_IN_FUTURE,
                path: ['startDate'],
                fatal: true,
            });

            return z.NEVER;
        }

        if (payload.endDate && payload.startDate > payload.endDate) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: ErrorMessage.CRON_JOB_START_DATE_COME_BEFORE_END_DATE,
                path: ['startDate'],
                fatal: true,
            });

            return z.NEVER;
        }
    })
    .openapi('CronJobPayload');

export { cronJobPayloadSchema, cronJobTypeSchema };
