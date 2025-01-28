import { DispatchAction } from '../dispatch/dispatch.types';
import { UserInterfaceState } from '../reducers/ui/ui.types';
import { UserState } from '../reducers/user/user.types';


type State = {
    ui: UserInterfaceState;
    user: UserState;
    // eslint-disable-next-line no-unused-vars
    dispatch: (action: DispatchAction) => void;
}

export type {
    State
}