import { DbContext } from 'aop/db/mongo/context';
import { DelegatorContext } from 'aop/delegator/context';
import { SchedulerContext } from 'aop/scheduler/context';

export class Context {
    db: DbContext;
    delegator: DelegatorContext;
    scheduler: SchedulerContext;
    user: {
        id: string;
        email: string;
    };
}
