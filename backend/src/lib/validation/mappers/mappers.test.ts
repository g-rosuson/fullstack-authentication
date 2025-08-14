import { z } from 'zod';

import mappers from './index';

describe('mappers', () => {
    describe('mapToErrors', () => {
        it('should extract property names from simple field errors', () => {
            const nameProperty = 'name';
            const emailProperty = 'email';

            const schema = z.object({
                [nameProperty]: z.string(),
                [emailProperty]: z.string().email(),
            });

            const result = schema.safeParse({
                [nameProperty]: 123,
                [emailProperty]: 'invalid-email',
            });

            expect(result.success).toBe(false);

            if (!result.success) {
                const mappedErrors = mappers.mapToErrors(result.error);

                expect(mappedErrors).toEqual([
                    { property: nameProperty, message: expect.any(String) },
                    { property: emailProperty, message: expect.any(String) },
                ]);
            }
        });

        it('should extract property names from nested object errors', () => {
            const nameProperty = 'name';
            const bioProperty = 'bio';

            const schema = z.object({
                user: z.object({
                    [nameProperty]: z.string(),
                    profile: z.object({
                        [bioProperty]: z.string(),
                    }),
                }),
            });

            const result = schema.safeParse({
                user: {
                    [nameProperty]: 123,
                    profile: {
                        [bioProperty]: 456,
                    },
                },
            });

            expect(result.success).toBe(false);

            if (!result.success) {
                const mappedErrors = mappers.mapToErrors(result.error);

                expect(mappedErrors).toEqual([
                    { property: nameProperty, message: expect.any(String) },
                    { property: bioProperty, message: expect.any(String) },
                ]);
            }
        });

        it('should extract property names from array element errors', () => {
            const nameProperty = 'name';
            const emailProperty = 'email';

            const schema = z.object({
                users: z.array(
                    z.object({
                        [nameProperty]: z.string(),
                        [emailProperty]: z.string().email(),
                    })
                ),
            });

            const result = schema.safeParse({
                users: [
                    { [nameProperty]: 123, [emailProperty]: 'invalid' },
                    { [nameProperty]: 'John', [emailProperty]: 'john@example.com' },
                ],
            });

            expect(result.success).toBe(false);

            if (!result.success) {
                const mappedErrors = mappers.mapToErrors(result.error);

                expect(mappedErrors).toEqual([
                    { property: nameProperty, message: expect.any(String) },
                    { property: emailProperty, message: expect.any(String) },
                ]);
            }
        });

        it('should handle deeply nested property errors', () => {
            const phoneProperty = 'phone';

            const schema = z.object({
                company: z.object({
                    departments: z.array(
                        z.object({
                            employees: z.array(
                                z.object({
                                    personal: z.object({
                                        contact: z.object({
                                            [phoneProperty]: z.string(),
                                        }),
                                    }),
                                })
                            ),
                        })
                    ),
                }),
            });

            const result = schema.safeParse({
                company: {
                    departments: [
                        {
                            employees: [
                                {
                                    personal: {
                                        contact: {
                                            [phoneProperty]: 123,
                                        },
                                    },
                                },
                            ],
                        },
                    ],
                },
            });

            expect(result.success).toBe(false);

            if (!result.success) {
                const mappedErrors = mappers.mapToErrors(result.error);

                expect(mappedErrors).toEqual([{ property: phoneProperty, message: expect.any(String) }]);
            }
        });

        it('should preserve error messages from Zod', () => {
            const ageProperty = 'age';
            const emailProperty = 'email';
            const ageMessage = 'Must be at least 18 years old';
            const emailMessage = 'Invalid email format';

            const schema = z.object({
                [ageProperty]: z.number().min(18, ageMessage),
                [emailProperty]: z.string().email(emailMessage),
            });

            const result = schema.safeParse({
                [ageProperty]: 15,
                [emailProperty]: 'not-an-email',
            });

            expect(result.success).toBe(false);

            if (!result.success) {
                const mappedErrors = mappers.mapToErrors(result.error);

                expect(mappedErrors).toEqual([
                    { property: ageProperty, message: ageMessage },
                    { property: emailProperty, message: emailMessage },
                ]);
            }
        });
    });
});
