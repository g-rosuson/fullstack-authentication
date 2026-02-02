import type { z } from 'zod';

import { requestUserDataSchema } from '../schemas';
import { descriptionSectionSchema, informationItemSchema } from 'shared/schemas/jobs';

/**
 * A description section type.
 */
type DescriptionSection = z.infer<typeof descriptionSectionSchema>;

/**
 * An information item type.
 */
type InformationItem = z.infer<typeof informationItemSchema>;

/**
 * A request user data type.
 */
type RequestUserData = z.infer<typeof requestUserDataSchema>;

/**
 * A scraper request interface.
 */
interface Request {
    url: string;
    userData: RequestUserData;
}

export type { DescriptionSection, InformationItem, Request, RequestUserData };
