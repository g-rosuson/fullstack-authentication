import { Router } from 'express';

import { OPENAPI_ROUTE } from './constants';

import { openApiDocument } from 'services/openapi/generate-spec';

// Determine router
const router = Router();

// Determine route
router.get(OPENAPI_ROUTE, (_req, res) => res.json(openApiDocument));

export default router;
