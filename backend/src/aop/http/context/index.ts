import { DbContext } from 'aop/db/mongo/context';

export class Context {
    db: DbContext;
    user: {
        id: string;
        email: string;
    };
}
