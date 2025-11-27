import dbContextMiddleware from './db-context';
import delegatorContextMiddleware from './delegator-context';
import schedulerContextMiddleware from './scheduler-context';

const contextMiddleware = [dbContextMiddleware, schedulerContextMiddleware, delegatorContextMiddleware];

export default contextMiddleware;
