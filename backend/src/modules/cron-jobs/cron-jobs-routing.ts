import { Router } from 'express';

import { createCronJob, deleteCronJob, getAllCronJobs, getCronJob, updateCronJob } from './cron-jobs-controller';
import { validateIdQueryParams, validatePaginationQueryParams, validatePayload } from './cron-jobs-middleware';

import {
    CREATE_CRON_JOB_ROUTE,
    DELETE_CRON_JOB_ROUTE,
    GET_ALL_CRON_JOBS_ROUTE,
    GET_CRON_JOB_ROUTE,
    UPDATE_CRON_JOB_ROUTE,
} from './constants';

// Determine router
const router = Router();

// Determine routes
router.post(CREATE_CRON_JOB_ROUTE, validatePayload, createCronJob);
router.get(GET_ALL_CRON_JOBS_ROUTE, validatePaginationQueryParams, getAllCronJobs);
router.get(GET_CRON_JOB_ROUTE, validateIdQueryParams, getCronJob);
router.put(UPDATE_CRON_JOB_ROUTE, validatePayload, validateIdQueryParams, updateCronJob);
router.delete(DELETE_CRON_JOB_ROUTE, validateIdQueryParams, deleteCronJob);

export default router;
