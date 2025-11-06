import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

extendZodWithOpenApi(z);

const userDocumentSchema = z
    .object({
        firstName: z.string(),
        lastName: z.string(),
        password: z.string(),
        email: z.string().email(),
        _id: z.instanceof(ObjectId),
    })
    .openapi('UserDocument');

export { userDocumentSchema };
