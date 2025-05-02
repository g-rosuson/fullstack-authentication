import { Issue } from 'lib/validation/types';

type Error = {
    message?: string;
    issues?: Issue[];
};

export type { Error };
