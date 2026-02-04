import { z } from 'zod';

/**
 * A request user data schema.
 */
const requestUserDataSchema = z.object({
    label: z.enum(['target-request', 'extraction-request']),
    targetId: z.string(),
    target: z.enum(['jobs-ch']),
    keywords: z.array(z.string()),
    maxPages: z.number(),
    // This property is added by crawlee under the hood
    __crawlee: z.unknown().optional(),
});

export { requestUserDataSchema };
