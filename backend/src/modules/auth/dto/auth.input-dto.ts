import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

// Register
const registerInputDto = z
    .object({
        password: z.string().min(8),
        email: z.string().email(),
    })
    .openapi('RegisterInputDto');

type RegisterInputDto = z.infer<typeof registerInputDto>;

// Login
const loginInputDto = z
    .object({
        password: z.string().min(8),
        email: z.string().email(),
    })
    .openapi('LoginInputDto');

type LoginInputDto = z.infer<typeof loginInputDto>;

// JWT
const jwtInputDto = z.object({
    email: z.string().email(),
    id: z.string().uuid(),
});

type JWTInputDto = z.infer<typeof jwtInputDto>;

const schema = {
    registerInputDto,
    loginInputDto,
    jwtInputDto,
};

export type { RegisterInputDto, LoginInputDto, JWTInputDto };
export default schema;
