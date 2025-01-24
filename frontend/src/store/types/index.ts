import { DispatchAction } from '../dispatch/dispatch.types';
import { AuthenticationState } from '../reducers/authentication/auth.types';
import { UserInterfaceState } from '../reducers/ui/ui.types';


type State = {
    ui: UserInterfaceState;
    authentication: AuthenticationState;
    // eslint-disable-next-line no-unused-vars
    dispatch: (action: DispatchAction) => void;
}

export type {
    State
}