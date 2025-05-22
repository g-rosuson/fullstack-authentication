import reducers from '../reducers';
import { Action } from '../types';

const dispatchAction = (action: Action) => {
    if (action.domain === 'user') {
        if (action.reducerType === 'change_user') {
            return reducers.user.changeUser(action.payload);
        }

        if (action.reducerType === 'clear_user') {
            return reducers.user.clearUser();
        }
    }

    if (action.domain === 'ui') {
         if (action.reducerType === 'change_theme') {
            return reducers.ui.changeTheme(action.payload);
        }
    }

    if (window.metadata.isDeveloping) {
        throw new Error(`[Store]: Could not process dispatch action: ${JSON.stringify(action)}`);
    }

    return {};
};

export default dispatchAction;