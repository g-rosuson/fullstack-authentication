import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { SchemaValidationException } from 'aop/exceptions';

import { validateEnvironmentVariables } from './validate-env';

describe('validateEnvironmentVariables', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        process.env = { ...originalEnv };
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    describe('when NODE_ENV is development', () => {
        it('should return correct development config when all variables are valid', () => {
            const nodeEnvValue = 'development';
            const devClientUrlValue = 'http://localhost:3000';
            const devDomainValue = 'localhost';

            process.env.NODE_ENV = nodeEnvValue;
            process.env.DEV_CLIENT_URL = devClientUrlValue;
            process.env.DEV_DOMAIN = devDomainValue;

            const result = validateEnvironmentVariables();

            expect(result).toEqual({
                isDeveloping: true,
                clientUrl: devClientUrlValue,
                domain: devDomainValue,
            });
        });

        it('should throw SchemaValidationException for missing DEV_CLIENT_URL', () => {
            process.env.NODE_ENV = 'development';
            delete process.env.DEV_CLIENT_URL;

            expect(() => validateEnvironmentVariables()).toThrow(SchemaValidationException);
        });

        it('should throw SchemaValidationException for invalid DEV_CLIENT_URL', () => {
            process.env.NODE_ENV = 'development';
            process.env.DEV_CLIENT_URL = 'not-a-url';

            expect(() => validateEnvironmentVariables()).toThrow(SchemaValidationException);
        });

        it('should throw SchemaValidationException for missing DEV_DOMAIN', () => {
            process.env.NODE_ENV = 'development';
            process.env.DEV_CLIENT_URL = 'http://localhost:3000';
            delete process.env.DEV_DOMAIN;

            expect(() => validateEnvironmentVariables()).toThrow(SchemaValidationException);
        });
    });

    describe('when NODE_ENV is production', () => {
        it('should return correct production config when all variables are valid', () => {
            const nodeEnvValue = 'production';
            const prodClientUrlValue = 'https://example.com';
            const prodDomainValue = 'example.com';

            process.env.NODE_ENV = nodeEnvValue;
            process.env.PROD_CLIENT_URL = prodClientUrlValue;
            process.env.PROD_DOMAIN = prodDomainValue;

            const result = validateEnvironmentVariables();

            expect(result).toEqual({
                isDeveloping: false,
                clientUrl: prodClientUrlValue,
                domain: prodDomainValue,
            });
        });

        it('should throw SchemaValidationException for missing PROD_CLIENT_URL', () => {
            process.env.NODE_ENV = 'production';
            delete process.env.PROD_CLIENT_URL;

            expect(() => validateEnvironmentVariables()).toThrow(SchemaValidationException);
        });

        it('should throw SchemaValidationException for invalid PROD_CLIENT_URL', () => {
            process.env.NODE_ENV = 'production';
            process.env.PROD_CLIENT_URL = 'not-a-url';

            expect(() => validateEnvironmentVariables()).toThrow(SchemaValidationException);
        });

        it('should throw SchemaValidationException for missing PROD_DOMAIN', () => {
            process.env.NODE_ENV = 'production';
            process.env.PROD_CLIENT_URL = 'https://example.com';
            delete process.env.PROD_DOMAIN;

            expect(() => validateEnvironmentVariables()).toThrow(SchemaValidationException);
        });
    });

    describe('when NODE_ENV is invalid', () => {
        it('should throw SchemaValidationException for missing NODE_ENV', () => {
            delete process.env.NODE_ENV;

            expect(() => validateEnvironmentVariables()).toThrow(SchemaValidationException);
        });

        it('should throw SchemaValidationException for invalid NODE_ENV value', () => {
            process.env.NODE_ENV = 'invalid';

            expect(() => validateEnvironmentVariables()).toThrow(SchemaValidationException);
        });
    });
});
