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

const logoutOutputDto = z
    .object({
        loggedOut: z.boolean(),
    })
    .openapi('LogoutOutputDto');

type AuthenticationOutputDto = z.infer<typeof authenticationOutputDto>;
type LogoutOutputDto = z.infer<typeof logoutOutputDto>;

const schema = {
    authenticationOutputDto,
    logoutOutputDto,
};

export type { AuthenticationOutputDto, LogoutOutputDto };
export default schema;
