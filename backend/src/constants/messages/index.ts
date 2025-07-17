import { resolvePlaceholders } from './utils';

import loggerMessages from './messages.logging';
import errorMessages from './messages.response';

// Determine all messages
const messages = {
    logger: loggerMessages,
    error: errorMessages,
};

export { resolvePlaceholders };
export default messages;
