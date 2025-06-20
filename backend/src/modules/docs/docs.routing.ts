import { Router } from 'express';

import config from './docs.config';

import { openApiDocument } from 'services/openapi/generate-spec';

// Determine router
const router = Router();

// Determine route
router.get(config.route.openapi, (_req, res) => res.json(openApiDocument));

export default router;
