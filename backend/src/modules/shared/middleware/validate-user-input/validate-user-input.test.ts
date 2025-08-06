import { Request, Response } from 'express';

import { InputValidationException } from 'aop/exceptions';

import validateInput from '.';

describe('validateUserInput middleware: ', () => {
    // Determine invalid request bodies: Everything besides a plain object
    const invalidRequestBodies = [null, undefined, [], 'string', 123, true, false, () => ({})];

    it.each(invalidRequestBodies)('throws InputValidationException when request body is not an object: %p', body => {
        const mockNext = vi.fn();
        const response = {} as unknown as Response;
        const request = { body } as Request;

        expect(() => validateInput(request, response, mockNext)).toThrow(InputValidationException);
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('calls next when body is a valid plain object without HTML', () => {
        const mockNext = vi.fn();
        const response = {} as unknown as Response;
        const request = {
            body: {
                name: 'John Doe',
                email: 'john@example.com',
            },
        } as Request;

        validateInput(request, response, mockNext);

        expect(mockNext).toHaveBeenCalled();
    });

    it('throws InputValidationException when body contains top-level HTML', () => {
        const mockNext = vi.fn();
        const response = {} as unknown as Response;
        const request = {
            body: {
                name: '<script>alert(1)</script>',
            },
        } as Request;

        expect(() => validateInput(request, response, mockNext)).toThrow(InputValidationException);
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('throws InputValidationException when body contains nested HTML', () => {
        const mockNext = vi.fn();
        const response = {} as unknown as Response;
        const request = {
            body: {
                user: {
                    bio: '<div>bio here</div>',
                },
            },
        } as Request;

        expect(() => validateInput(request, response, mockNext)).toThrow(InputValidationException);
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('calls next when body contains deeply nested safe strings', () => {
        const mockNext = vi.fn();
        const response = {} as unknown as Response;
        const request = {
            body: {
                user: {
                    bio: 'Just a plain bio.',
                    social: {
                        twitter: '@user',
                    },
                },
            },
        } as Request;

        validateInput(request, response, mockNext);

        expect(mockNext).toHaveBeenCalled();
    });

    it('calls next when body contains non-string values (numbers, booleans)', () => {
        const mockNext = vi.fn();
        const response = {} as unknown as Response;
        const request = {
            body: {
                age: 30,
                active: true,
            },
        } as Request;

        validateInput(request, response, mockNext);

        expect(mockNext).toHaveBeenCalled();
    });
});
