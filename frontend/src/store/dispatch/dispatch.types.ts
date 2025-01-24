import { AccessToken } from '../reducers/authentication/auth.types';
import { Theme } from '../reducers/ui/ui.types';

// Generate dispatch action types
type Action<Payload> = {
    type: string;
    payload: Payload;
}

// Dispatch actions
type AccessTokenDispatchAction = Action<AccessToken>;
type ThemeDispatchAction = Action<Theme>;

type DispatchAction =  ThemeDispatchAction | AccessTokenDispatchAction;


export type {
    ThemeDispatchAction,
    AccessTokenDispatchAction,
    DispatchAction
}