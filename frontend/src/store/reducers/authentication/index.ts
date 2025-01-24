import { ChangeAccessTokenReducer } from './auth.types';

const changeAccessToken: ChangeAccessTokenReducer = {
    type: 'change_access_token',
    action: (payload, state) => ({
        ...state,
        accessToken: payload
    })
};

const reducers = [
    changeAccessToken
];

export default reducers;