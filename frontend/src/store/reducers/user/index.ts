import { UserState } from '../../types';

const clearUser = (): UserState  => ({
    accessToken: null,
    email: null,
    id: null
});

const changeUser = (payload: UserState): UserState => payload;

const reducers = {
   changeUser,
   clearUser
}

export default reducers;