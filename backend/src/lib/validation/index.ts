import { ZodSchema } from 'zod';

import { SchemaResult } from './types';

import mappers from './mappers';

export const parseSchema = <T>(schema: ZodSchema<T>, data: unknown): SchemaResult<T> => {
    const { success, data: parsedData, error } = schema.safeParse(data);

    return success ? { success, data: parsedData } : { success, issues: mappers.mapToErrors(error) };
};
