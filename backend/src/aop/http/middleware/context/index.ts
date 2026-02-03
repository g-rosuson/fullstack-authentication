import authenticateContextMiddleware from './authenticate-context';
import dbContextMiddleware from './db-context';
import delegatorContextMiddleware from './delegator-context';
import schedulerContextMiddleware from './scheduler-context';

const contextResourceMiddleware = [dbContextMiddleware, schedulerContextMiddleware, delegatorContextMiddleware];

export { authenticateContextMiddleware };
export default contextResourceMiddleware;
