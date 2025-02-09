import { ChangeThemeReducerType, Theme, UIDomain } from '../reducers/ui/ui.types';
import { ChangeUserReducerType, ClearUserReducerType, User, UserDomain } from '../reducers/user/user.types';

// Generate dispatch action types
type Action<Type, Payload> = {
    type: Type;
    payload?: Payload;
}

// Action types
// User
type ChangeUserAction = `${UserDomain}/${ChangeUserReducerType}`;
type ClearUserAction = `${UserDomain}/${ClearUserReducerType}`;

// Theme
type ThemeAction = `${UIDomain}/${ChangeThemeReducerType}`;


// Dispatch actions
// User
type ChangeUserDispatchAction = Action<ChangeUserAction, User>;
type ClearUserDispatchAction = Action<ClearUserAction, User>;

// Theme
type ThemeDispatchAction = Action<ThemeAction, Theme>;

type DispatchAction =  ThemeDispatchAction | ChangeUserDispatchAction | ClearUserDispatchAction;


export type {
    ThemeDispatchAction,
    DispatchAction
}