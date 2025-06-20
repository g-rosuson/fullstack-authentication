import { ZodSchema } from 'zod';

import mappers from './mappers';

import { SchemaResult } from './types';

export const parseSchema = <T>(schema: ZodSchema<T>, data: unknown): SchemaResult<T> => {
    const { success, data: parsedData, error } = schema.safeParse(data);

    return success ? { success, data: parsedData } : { success, issues: mappers.mapToErrors(error) };
};
