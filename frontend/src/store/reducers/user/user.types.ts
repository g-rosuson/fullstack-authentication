import { Reducer } from '../types';

// User domain
type UserDomain = 'user';


// User state
type UserState = {
    accessToken: string | null;
    email: string;
    id: string;
}


// User payload
type User = UserState;


// Change user reducer-type
type ChangeUserReducerType = 'change_user';
type ClearUserReducerType = 'clear_user';


// Reducer
type ChangeUserReducer = Reducer<ChangeUserReducerType, User, UserState>
type ClearUserReducer = Reducer<ClearUserReducerType, User, UserState>

export type {
    ChangeUserReducerType,
    ClearUserReducerType,
    ChangeUserReducer,
    ClearUserReducer,
    UserDomain,
    UserState,
    User
}