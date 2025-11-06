import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

import {
    CREATE_CRON_JOB_ROUTE,
    DELETE_CRON_JOB_ROUTE,
    GET_ALL_CRON_JOBS_ROUTE,
    GET_CRON_JOB_ROUTE,
    UPDATE_CRON_JOB_ROUTE,
} from 'modules/cron-jobs/constants';

import { cronJobPayloadSchema } from './schemas';
import { cronJobDocumentSchema } from 'shared/schemas/db/documents/cron-job';
import { idRouteParamSchema, paginatedRouteParamSchema } from 'shared/schemas/routeParam';

const cronJobsRegistry = new OpenAPIRegistry();

cronJobsRegistry.registerPath({
    method: 'post',
    path: CREATE_CRON_JOB_ROUTE,
    responses: {
        200: {
            description: 'Cron job created successfully',
            content: {
                'application/json': {
                    schema: cronJobDocumentSchema,
                },
            },
        },
    },
    request: {
        body: {
            description: 'Cron job payload',
            content: {
                'application/json': {
                    schema: cronJobPayloadSchema,
                },
            },
        },
    },
});

cronJobsRegistry.registerPath({
    method: 'delete',
    path: DELETE_CRON_JOB_ROUTE,
    responses: {
        200: {
            description: 'Cron job deleted successfully',
        },
    },
    request: {
        params: idRouteParamSchema,
    },
});

cronJobsRegistry.registerPath({
    method: 'get',
    path: GET_ALL_CRON_JOBS_ROUTE,
    responses: {
        200: {
            description: 'All cron jobs',
            content: {
                'application/json': {
                    schema: cronJobDocumentSchema.array(),
                },
            },
        },
    },
    request: {
        params: paginatedRouteParamSchema,
    },
});

cronJobsRegistry.registerPath({
    method: 'get',
    path: GET_CRON_JOB_ROUTE,
    responses: {
        200: {
            description: 'Cron job',
            content: {
                'application/json': {
                    schema: cronJobDocumentSchema,
                },
            },
        },
    },
    request: {
        params: idRouteParamSchema,
    },
});

cronJobsRegistry.registerPath({
    method: 'put',
    path: UPDATE_CRON_JOB_ROUTE,
    responses: {
        200: {
            description: 'Cron job updated successfully',
            content: {
                'application/json': {
                    schema: cronJobDocumentSchema,
                },
            },
        },
    },
    request: {
        params: idRouteParamSchema,
        body: {
            description: 'Cron job payload',
            content: {
                'application/json': {
                    schema: cronJobPayloadSchema,
                },
            },
        },
    },
});

export default cronJobsRegistry;
