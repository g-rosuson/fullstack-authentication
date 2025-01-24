import { Reducer } from '../types';

// User interface state
type UserInterfaceState = {
    theme: Theme;
}

// Theme
type Theme = 'dark' | 'light';

// All reducer types
type ChangeThemeReducerType = 'change_theme';

// Reducers
type ChangeThemeReducer = Reducer<ChangeThemeReducerType, Theme, UserInterfaceState>

export type {
    ChangeThemeReducerType,
    ChangeThemeReducer,
    UserInterfaceState,
    Theme
}