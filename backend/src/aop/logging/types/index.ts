import { Issue } from 'lib/validation/types';

interface Meta {
    error?: Error;
    issues?: Issue[];
}

export type { Meta };
