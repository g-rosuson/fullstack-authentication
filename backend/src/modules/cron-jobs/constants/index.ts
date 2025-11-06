// Routes
const CRON_JOBS_DOMAIN = '/cron-jobs';

export const CREATE_CRON_JOB_ROUTE = CRON_JOBS_DOMAIN + '/create';
export const DELETE_CRON_JOB_ROUTE = CRON_JOBS_DOMAIN + '/delete/:id';
export const UPDATE_CRON_JOB_ROUTE = CRON_JOBS_DOMAIN + '/update/:id';
export const GET_CRON_JOB_ROUTE = CRON_JOBS_DOMAIN + '/get/:id';
export const GET_ALL_CRON_JOBS_ROUTE = CRON_JOBS_DOMAIN + '/get-all';
