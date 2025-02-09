import { ChangeUserReducer, ClearUserReducer } from './user.types';

const changeUser: ChangeUserReducer = {
    type: 'change_user',
    action: (payload) => payload
};

const clearUser: ClearUserReducer = {
    type: 'clear_user',
    action: () => ({
        accessToken: null,
        email: '',
        id: ''
    })
};

const reducers = [
    changeUser,
    clearUser
];

export default reducers;