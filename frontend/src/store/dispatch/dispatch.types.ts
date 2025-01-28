import { ChangeThemeReducerType, Theme, UIDomain } from '../reducers/ui/ui.types';
import { ChangeUserReducerType, User, UserDomain } from '../reducers/user/user.types';

// Generate dispatch action types
type Action<Type, Payload> = {
    type: Type;
    payload: Payload;
}

// Action types
// Change user
type UserAction = `${UserDomain}/${ChangeUserReducerType}`;

// Change theme
type ThemeAction = `${UIDomain}/${ChangeThemeReducerType}`;


// Dispatch actions
type UserDispatchAction = Action<UserAction, User>;
type ThemeDispatchAction = Action<ThemeAction, Theme>;

type DispatchAction =  ThemeDispatchAction | UserDispatchAction;


export type {
    ThemeDispatchAction,
    DispatchAction
}