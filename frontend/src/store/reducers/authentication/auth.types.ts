import { Reducer } from '../types';

// Auth state
type AuthenticationState = {
    accessToken: AccessToken
}

// Access token
type AccessToken = string | null;

// Reducer types
type ChangeAccessTokenReducerType = 'change_access_token';

// Reducers
type ChangeAccessTokenReducer = Reducer<ChangeAccessTokenReducerType, AccessToken, AuthenticationState>


export type {
    AuthenticationState,
    AccessToken,
    ChangeAccessTokenReducer,
    ChangeAccessTokenReducerType
}