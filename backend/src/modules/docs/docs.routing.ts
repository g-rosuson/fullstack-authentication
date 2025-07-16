import { Router } from 'express';

import routes from 'constants/routes';

import { openApiDocument } from 'services/openapi/generate-spec';

// Determine router
const router = Router();

// Determine route
router.get(routes.docs.openapi, (_req, res) => res.json(openApiDocument));

export default router;
