import { z } from 'zod';

import { idRouteParamSchema } from '../schemas/routeParam';

type IdRouteParam = z.infer<typeof idRouteParamSchema>;

export type { IdRouteParam };
