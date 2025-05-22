type UserAction = 
    | { reducerType: 'clear_user', domain: 'user' }
    | { reducerType: 'change_user', domain: 'user', payload: UserState };

type UIAction = { reducerType: 'change_theme', domain: 'ui', payload: Theme };

type Action = UserAction | UIAction;

type Theme = 'dark' | 'light';

type UserState = {
    accessToken: string | null;
    email: string | null;
    id: string | null;
}

type UserInterfaceState = {
    theme: Theme;
}

type State = {
    ui: UserInterfaceState;
    user: UserState;
    dispatch: (action: Action) => void;
}

export type {
    Action,
    UserState,
    Theme,
    State
}