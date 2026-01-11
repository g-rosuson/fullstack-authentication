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
 * A scraper result schema.
 */
const scraperResultSchema = z.object({
    // Due to navigation a target result can have a different url than the parent target
    url: z.string().url(),
    result: z
        .object({
            title: z.string(),
            description: z.string(),
        })
        .nullable(),
    error: resultErrorSchema.nullable(),
});

/**
 * A scraper target schema.
 */
const scraperTargetSchema = z.object({
    // Results contains error and result
    results: z.array(scraperResultSchema).nullable(),
    keywords: z.array(z.string()).optional(),
    maxPages: z.number().positive().optional(),
    target: z.string().url(),
    id: z.string(),
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

export { resultErrorSchema, cronJobTypeSchema, scraperResultSchema, scraperToolSchema, toolSchema, toolTargetsSchema };
