import { Router } from 'express';

import { forwardSyncError } from 'aop/http/middleware/sync';

import { createJob, deleteJob, getAllJobs, getJob, updateJob } from './jobs-controller';
import { validateIdQueryParams, validatePaginationQueryParams, validatePayload } from './jobs-middleware';

import { CREATE_JOB_ROUTE, DELETE_JOB_ROUTE, GET_ALL_JOBS_ROUTE, GET_JOB_ROUTE, UPDATE_JOB_ROUTE } from './constants';

// Determine router
const router = Router();

// Determine routes
router.post(CREATE_JOB_ROUTE, validatePayload, createJob);
router.get(GET_ALL_JOBS_ROUTE, forwardSyncError(validatePaginationQueryParams), getAllJobs);
router.get(GET_JOB_ROUTE, forwardSyncError(validateIdQueryParams), getJob);
router.put(UPDATE_JOB_ROUTE, forwardSyncError(validatePayload), forwardSyncError(validateIdQueryParams), updateJob);
router.delete(DELETE_JOB_ROUTE, forwardSyncError(validateIdQueryParams), deleteJob);

export default router;
