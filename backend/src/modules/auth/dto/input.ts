import { z } from 'zod';

// Login/register
const authenticationInputDto = z.object({
    password: z.string().min(8),
    email: z.string().email(),
});

type AuthenticationInputDto = z.infer<typeof authenticationInputDto>;

// JWT
const jwtInputDto = z.object({
    email: z.string().email(),
    id: z.string().uuid(),
});

type JWTInputDto = z.infer<typeof jwtInputDto>;

const schema = {
    authenticationInputDto,
    jwtInputDto,
};

export type { AuthenticationInputDto, JWTInputDto };
export default schema;
