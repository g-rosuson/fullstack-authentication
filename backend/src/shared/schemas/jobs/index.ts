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
 * A scraper target schema.
 */
const scraperTargetSchema = z.object({
    // Results contains error and result
    results: z.array(scraperResultSchema).nullable(),
    keywords: z.array(z.string()).optional(),
    maxPages: z.number().positive().optional(),
    target: targetSchema,
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
};
