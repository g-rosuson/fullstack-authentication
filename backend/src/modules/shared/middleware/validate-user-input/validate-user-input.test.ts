import { Request, Response } from 'express';

import validateInput from '.';

// === Mock response module ===
const mockBadRequest = vi.hoisted(() => vi.fn());

vi.mock('api/response', async () => ({
    default: {
        badRequest: mockBadRequest,
    },
}));

describe('validateUserInput middleware: ', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // Determine invalid request bodies: Everything besides a plain object
    const invalidRequestBodies = [null, undefined, [], 'string', 123, true, false, () => ({})];

    it.each(invalidRequestBodies)('responds with: 400 Bad Request, when request body is not an object: %p', body => {
        const mockNext = vi.fn();
        const response = {} as unknown as Response;
        const request = { body } as Request;

        validateInput(request, response, mockNext);

        expect(mockBadRequest).toHaveBeenCalledWith(
            response,
            expect.objectContaining({ message: expect.stringContaining(`${typeof request.body}`) })
        );

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
        expect(mockBadRequest).not.toHaveBeenCalled();
    });

    it('responds with 400 Bad Request when body contains top-level HTML', () => {
        const mockNext = vi.fn();
        const response = {} as unknown as Response;
        const request = {
            body: {
                name: '<script>alert(1)</script>',
            },
        } as Request;

        validateInput(request, response, mockNext);

        expect(mockBadRequest).toHaveBeenCalledWith(
            response,
            expect.objectContaining({ message: expect.stringContaining('HTML tags are not allowed') })
        );
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('responds with 400 Bad Request when body contains nested HTML', () => {
        const mockNext = vi.fn();
        const response = {} as unknown as Response;
        const request = {
            body: {
                user: {
                    bio: '<div>bio here</div>',
                },
            },
        } as Request;

        validateInput(request, response, mockNext);

        expect(mockBadRequest).toHaveBeenCalled();
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
        expect(mockBadRequest).not.toHaveBeenCalled();
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
        expect(mockBadRequest).not.toHaveBeenCalled();
    });
});
