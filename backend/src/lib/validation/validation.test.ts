import { z } from 'zod';

import { parseSchema } from './index';

describe('parseSchema', () => {
    it('should return success result with validated data when validation passes', () => {
        const nameProperty = 'name';
        const ageProperty = 'age';
        const nameValue = 'John';
        const ageValue = 30;

        const schema = z.object({
            [nameProperty]: z.string(),
            [ageProperty]: z.number(),
        });

        const validData = {
            [nameProperty]: nameValue,
            [ageProperty]: ageValue,
        };

        const result = parseSchema(schema, validData);

        expect(result).toEqual({
            success: true,
            data: validData,
        });
    });

    it('should return failure result with mapped errors when validation fails', () => {
        const nameProperty = 'name';
        const ageProperty = 'age';

        const schema = z.object({
            [nameProperty]: z.string(),
            [ageProperty]: z.number(),
        });

        const invalidData = {
            [nameProperty]: 123,
            [ageProperty]: 'not-a-number',
        };

        const result = parseSchema(schema, invalidData);

        expect(result).toEqual({
            success: false,
            issues: [
                { property: nameProperty, message: expect.any(String) },
                { property: ageProperty, message: expect.any(String) },
            ],
        });
    });

    it('should handle empty object validation', () => {
        const schema = z.object({});

        const result = parseSchema(schema, {});

        expect(result).toEqual({
            success: true,
            data: {},
        });
    });

    it('should handle non-object schema validation', () => {
        const stringValue = 'hello';
        const numberValue = 42;

        const stringSchema = z.string();
        const numberSchema = z.number();

        const stringResult = parseSchema(stringSchema, stringValue);
        const numberResult = parseSchema(numberSchema, numberValue);

        expect(stringResult).toEqual({
            success: true,
            data: stringValue,
        });

        expect(numberResult).toEqual({
            success: true,
            data: numberValue,
        });
    });
});
