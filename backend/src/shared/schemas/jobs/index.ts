import z from 'zod';

/**
 * A result schema for a target.
 */
const resultSchema = z.object({
    targetId: z.string(),
    output: z.object({}),
});

const cronJobTypeSchema = z.enum(['once', 'daily', 'weekly', 'monthly', 'yearly']);

/**
 * An error schema for a target.
 */
const targetErrorSchema = z.object({
    targetId: z.string(),
    message: z.string(),
});

/**
 * A scraper result schema.
 */
const scraperResultSchema = resultSchema.extend({
    target: z.string().url(),
    keywords: z.array(z.string()),
    maxPages: z.number().positive(),
});

/**
 * A scraper target schema.
 */
const scraperTargetSchema = z.object({
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
    results: z.array(scraperResultSchema).nullable(),
    errors: z.array(targetErrorSchema).nullable(),
});

/**
 * An email result schema.
 */
const emailResultSchema = resultSchema.extend({
    target: z.string().email(),
    subject: z.string(),
    body: z.string(),
});

/**
 * An email target schema.
 */
const emailTargetSchema = z.object({
    subject: z.string().optional(),
    body: z.string().optional(),
    target: z.string().email(),
    id: z.string(),
});

/**
 * A email tool schema.
 */
const emailToolSchema = z.object({
    type: z.literal('email'),
    targets: z.array(emailTargetSchema),
    subject: z.string(),
    body: z.string(),
    results: z.array(emailResultSchema).nullable(),
    errors: z.array(targetErrorSchema).nullable(),
});

/**
 * A tool has targets and the configuration of the members vary depending on the tool type.
 */
const toolSchema = z.union([scraperToolSchema, emailToolSchema]);

export {
    cronJobTypeSchema,
    targetErrorSchema,
    scraperResultSchema,
    emailResultSchema,
    scraperToolSchema,
    emailToolSchema,
    toolSchema,
};
