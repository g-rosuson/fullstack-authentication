import { z } from 'zod';

const jwtInputDto = z.object({
    email: z.string().email(),
    id: z.string().uuid(),
});

type JWTInputDto = z.infer<typeof jwtInputDto>;

const schema = {
    jwtInputDto,
};

export type { JWTInputDto };
export default schema;
