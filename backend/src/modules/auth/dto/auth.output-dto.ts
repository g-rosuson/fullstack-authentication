import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

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
