import { create } from 'zustand';

import actions from './actions';
import constants from './constants';
import dispatchAction from './dispatch';
import { Action, State } from './types';

const useStore = create<State>()(
    set => ({
        ...constants.state,
        dispatch: (action: Action) => {
            set(state => ({
                ...state,
                [action.domain]: {
                    ...state[action.domain],
                    ...dispatchAction(action)
                },
            }));
        }
    })
);

export { useStore, actions };