import { z } from 'zod';

import { InputValidationException } from 'aop/exceptions/errors/validation';

import { validateRequestPayload } from './validators-request-payload';

describe('validateRequestPayload function', () => {
    const testSchema = z.object({
        name: z.string(),
        email: z.string().email(),
        age: z.number().min(18),
    });

    const errorMessage = 'Invalid payload provided';

    describe('validation success', () => {
        it('should return the validated payload', () => {
            const validData = {
                name: 'John Doe',
                email: 'john@example.com',
                age: 25,
            };

            const validatedPayload = validateRequestPayload(testSchema, validData, errorMessage);

            expect(validatedPayload).toEqual(validData);
        });
    });

    describe('validation failure', () => {
        it('should throw InputValidationException when validation fails and not call next()', () => {
            const invalidData = {
                name: 'John Doe',
                email: 'invalid-email',
                age: 25,
            };

            expect(() => validateRequestPayload(testSchema, invalidData, errorMessage)).toThrow(
                InputValidationException
            );
        });
    });
});
