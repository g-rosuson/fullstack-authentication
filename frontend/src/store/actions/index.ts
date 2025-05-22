import constants from '../constants';
import { Theme, UserState } from '../types';

const actions = {
    user: {
        clearUser: () => ({
            reducerType: constants.user.reducer.clearUser,
            domain: constants.user.domain
        }),
        changeUser: (payload: UserState) => ({ 
            reducerType: constants.user.reducer.changeUser,
            domain: constants.user.domain,
            payload
        })
    },
    ui: {
        changeTheme: (payload: Theme) => ({ 
            reducerType: constants.ui.reducer.changeTheme,
            domain: constants.ui.domain,
            payload
        })
    }
};

export default actions;