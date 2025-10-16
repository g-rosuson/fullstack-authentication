import { z } from 'zod';

import { userDocumentSchema } from 'shared/schemas/db/documents/user';

type __UserDocument = z.infer<typeof userDocumentSchema>;
type __PickedUserDocument = Pick<__UserDocument, 'firstName' | 'lastName' | 'password' | 'email'>;

type CreateUserPayload = __PickedUserDocument;

export type { CreateUserPayload };
