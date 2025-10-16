import { DbContext } from 'aop/db/mongo/context';
import { SchedulerContext } from 'aop/scheduler/context';

export class Context {
    db: DbContext;
    scheduler: SchedulerContext;
    user: {
        id: string;
        email: string;
    };
}
