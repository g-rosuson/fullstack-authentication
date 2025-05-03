import { Router } from 'express';
import { openApiDocument } from 'services/openapi/generate-spec';

import config from './docs.config';

// Determine router
const router = Router();

// Determine route
router.get(config.route.openapi, (_req, res) => res.json(openApiDocument));

export default router;
