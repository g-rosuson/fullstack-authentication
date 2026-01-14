import type constants from '../constants';
import type { descriptionSectionSchema, informationItemSchema } from 'shared/schemas/jobs';
import type { z } from 'zod';

type PlatformConfigKey = keyof typeof constants.platformConfiguration;

type PlatformConfiguration = (typeof constants.platformConfiguration)[PlatformConfigKey];

type DescriptionSection = z.infer<typeof descriptionSectionSchema>;

type InformationItem = z.infer<typeof informationItemSchema>;

interface Request {
    url: string;
    label: string;
    userData: {
        targetId: string;
        platformConfiguration: PlatformConfiguration;
        keywords: string[];
        maxPages: number;
    };
}

export type { DescriptionSection, InformationItem, PlatformConfigKey, PlatformConfiguration, Request };
