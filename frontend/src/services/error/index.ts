import { CustomErrorContext } from './types';

class CustomError extends Error {
    context: CustomErrorContext;

    constructor(message: string, context: CustomErrorContext = {}) {
        super(message);
        this.name = 'error-with-ctx';
        this.context = context;
    }
}

export { CustomError };