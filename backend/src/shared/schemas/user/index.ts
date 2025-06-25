import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

extendZodWithOpenApi(z);

const userDocumentSchema = z
    .object({
        password: z.string().min(8),
        email: z.string().email(),
        _id: z.instanceof(ObjectId),
    })
    .openapi('UserDocument');

export { userDocumentSchema };
