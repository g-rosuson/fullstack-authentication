import { z } from 'zod';

import { errorIssueSchema } from '../schemas';

type ErrorIssue = z.infer<typeof errorIssueSchema>;

interface CustomErrorContext {
    cause?: Error;
    issues?: ErrorIssue[];
    timestamp?: number;
}

export type { CustomErrorContext };