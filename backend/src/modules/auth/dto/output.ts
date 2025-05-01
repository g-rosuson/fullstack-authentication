import { z } from 'zod';

const authenticationOutputDto = z.object({
    accessToken: z.string().jwt(),
    email: z.string().email(),
    id: z.string().uuid(),
});

type AuthenticationOutputDto = z.infer<typeof authenticationOutputDto>;

const schema = {
    authenticationOutputDto,
};

export type { AuthenticationOutputDto };
export default schema;
