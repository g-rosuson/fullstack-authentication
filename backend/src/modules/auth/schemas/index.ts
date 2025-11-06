import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

// Password schema
const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must include an uppercase letter')
    .regex(/[a-z]/, 'Password must include a lowercase letter')
    .regex(/\d+/, 'Password must include a number')
    .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/, 'Password must include a special character');

// Login schema
const loginUserPayloadSchema = z
    .object({
        password: passwordSchema,
        email: z.string().email(),
    })
    .openapi('LoginUserPayload');

// Access-token schema
const accessTokenSchema = z.string().jwt().openapi('AccessToken');

// JWT payload schema
const jwtPayloadSchema = z
    .object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().email(),
        id: z.string(),
    })
    .openapi('JwtPayload');

const registerUserPayloadSchema = z
    .object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().email(),
        password: passwordSchema,
        confirmationPassword: passwordSchema,
    })
    // Check if passwords match
    .refine(data => data.password === data.confirmationPassword, {
        path: ['confirmationPassword'],
        message: 'Passwords do not match',
    })
    .openapi('RegisterUserPayload');

export { accessTokenSchema, jwtPayloadSchema, loginUserPayloadSchema, passwordSchema, registerUserPayloadSchema };
