import { ChangeUserReducer } from './user.types';

const changeUser: ChangeUserReducer = {
    type: 'change_user',
    action: (payload) => payload
};

const reducers = [
    changeUser
];

export default reducers;