import { JwtPayload } from 'modules/auth/types';

import jwt from './index';

describe('JWT Service', () => {
    // Test data
    const mockPayload: JwtPayload = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        id: '507f1f77bcf86cd799439011',
    };

    describe('createTokens', () => {
        it('should return an object with accessToken and refreshToken properties', () => {
            const result = jwt.createTokens(mockPayload);

            expect(result).toHaveProperty('accessToken');
            expect(result).toHaveProperty('refreshToken');
            expect(typeof result.accessToken).toBe('string');
            expect(typeof result.refreshToken).toBe('string');
        });

        it('should return different tokens for access and refresh', () => {
            const result = jwt.createTokens(mockPayload);

            // The tokens should be different since they use different secrets and expiration
            expect(result.accessToken).not.toBe(result.refreshToken);
        });
    });
});
