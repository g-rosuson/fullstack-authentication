import { ValidationIssue } from 'lib/validation/types';

type Error = {
    message: string;
    issues?: ValidationIssue[];
};

export type { Error };
