import { Router } from 'express';

import { forwardAsyncError } from 'aop/http/middleware/async';
import { forwardSyncError } from 'aop/http/middleware/sync';

import { createJob, deleteJob, getAllJobs, getJob, updateJob } from './jobs-controller';
import { validateIdQueryParams, validatePaginationQueryParams, validatePayload } from './jobs-middleware';

import { CREATE_JOB_ROUTE, DELETE_JOB_ROUTE, GET_ALL_JOBS_ROUTE, GET_JOB_ROUTE, UPDATE_JOB_ROUTE } from './constants';

// Determine router
const router = Router();

// Determine routes
router.post(CREATE_JOB_ROUTE, forwardSyncError(validatePayload), forwardAsyncError(createJob));
router.get(GET_ALL_JOBS_ROUTE, forwardSyncError(validatePaginationQueryParams), forwardAsyncError(getAllJobs));
router.get(GET_JOB_ROUTE, forwardSyncError(validateIdQueryParams), forwardAsyncError(getJob));
router.put(
    UPDATE_JOB_ROUTE,
    forwardSyncError(validatePayload),
    forwardSyncError(validateIdQueryParams),
    forwardAsyncError(updateJob)
);
router.delete(DELETE_JOB_ROUTE, forwardSyncError(validateIdQueryParams), forwardAsyncError(deleteJob));

export default router;
