import z from 'zod';

/**
 * A cron job type schema.
 */
const cronJobTypeSchema = z.enum(['once', 'daily', 'weekly', 'monthly', 'yearly']);

/**
 * A result error schema.
 */
const resultErrorSchema = z.object({
    message: z.string(),
});

/**
 * A description section schema.
 */
const descriptionSectionSchema = z.object({
    title: z.string().optional(),
    blocks: z.array(z.string()),
});

/**
 * An information item schema.
 */
const informationItemSchema = z.object({
    label: z.string(),
    value: z.string(),
});

/**
 * A scraper result schema.
 */
const scraperResultSchema = z.object({
    result: z
        .object({
            url: z.string().url(),
            title: z.string(),
            description: z.array(descriptionSectionSchema),
            information: z.array(informationItemSchema),
        })
        .nullable(),
    error: resultErrorSchema.nullable(),
});

/**
 * A platform target schema.
 * Platform identifier - extendable: 'linkedin', 'indeed', etc.
 */
const targetSchema = z.enum(['jobs-ch']);

/**
 * A base target schema.
 */
const baseTargetSchema = z.object({
    results: z.array(scraperResultSchema).nullable(),
    target: targetSchema,
    id: z.string(),
});

/**
 * A scraper target schema.
 */
const scraperTargetSchema = baseTargetSchema.extend({
    keywords: z.array(z.string()).optional(),
    maxPages: z.number().positive().optional(),
});

/**
 * A schedule schema.
 */
const scheduleSchema = z.object({
    type: cronJobTypeSchema,
    startDate: z.coerce.date(),
    endDate: z.coerce.date().nullable(),
    nextRun: z.coerce.date(),
    lastRun: z.coerce.date().nullable(),
});

/**
 * A scraper tool schema.
 */
const scraperToolSchema = z.object({
    type: z.literal('scraper'),
    targets: z.array(scraperTargetSchema),
    keywords: z.array(z.string()),
    maxPages: z.number().positive(),
});

/**
 * A tool targets schema.
 */
const toolTargetsSchema = z.array(scraperTargetSchema);

/**
 * A tool has targets and the configuration of the members vary depending on the tool type.
 */
const toolSchema = scraperToolSchema;

/**
 * A execution payload schema.
 */
const executionSchema = z.object({
    schedule: z.object({
        type: cronJobTypeSchema.nullable(),
        delegatedAt: z.coerce.date(),
        finishedAt: z.coerce.date().nullable(),
    }),
    tools: z.array(scraperToolSchema).min(1),
});

export {
    descriptionSectionSchema,
    informationItemSchema,
    resultErrorSchema,
    cronJobTypeSchema,
    targetSchema,
    scraperResultSchema,
    scraperToolSchema,
    toolSchema,
    toolTargetsSchema,
    scheduleSchema,
    executionSchema,
};
