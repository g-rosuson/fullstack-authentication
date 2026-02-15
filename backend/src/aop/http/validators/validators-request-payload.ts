import { z, ZodTypeAny } from 'zod';

import { InputValidationException } from 'aop/exceptions/errors/validation';
import { parseSchema } from 'lib/validation';

/**
 * Validates that the request body adhears to the corresponding schema.
 * @param schema The schema to validate the request body against
 * @param errorMessage The error message to throw if the validation fails
 * @returns A middleware function that validates the request body
 */
const validateRequestPayload = <T extends ZodTypeAny>(
    schema: T,
    payload: unknown,
    errorMessage: string
): z.infer<T> => {
    const result = parseSchema(schema, payload);

    if (!result.success) {
        throw new InputValidationException(errorMessage, {
            issues: result.issues,
        });
    }

    return result.data;
};

export { validateRequestPayload };
