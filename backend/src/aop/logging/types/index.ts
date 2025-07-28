import { ValidationIssue } from 'lib/validation/types';

interface Meta {
    error?: Error;
    issues?: ValidationIssue[];
}

export type { Meta };
