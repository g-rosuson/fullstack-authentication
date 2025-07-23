import type { Context } from './aop/http/context';

declare global {
    namespace Express {
        export interface Request {
            context: Context;
        }
    }
}
