import dbContextMiddleware from './db-context';
import schedulerContextMiddleware from './scheduler-context';

const contextMiddleware = [dbContextMiddleware, schedulerContextMiddleware];

export default contextMiddleware;
