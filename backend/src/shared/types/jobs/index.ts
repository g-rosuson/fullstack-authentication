import { z } from 'zod';

import { executionSchema } from 'shared/schemas/jobs';

/**
 * A execution payload.
 */
type ExecutionPayload = z.infer<typeof executionSchema> & { jobId: string };

export type { ExecutionPayload };
