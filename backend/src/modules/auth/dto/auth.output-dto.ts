import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

const authenticationOutputDto = z
    .object({
        accessToken: z.string().jwt(),
        email: z.string().email(),
        id: z.string().uuid(),
    })
    .openapi('AuthenticationOutputDto');

type AuthenticationOutputDto = z.infer<typeof authenticationOutputDto>;

const schema = {
    authenticationOutputDto,
};

export type { AuthenticationOutputDto };
export default schema;
