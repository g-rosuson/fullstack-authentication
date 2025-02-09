import { create } from 'zustand';

import actions from './actions';
import { resources } from './dispatch';
import state from './state';
import { State } from './types';


const useStore = create<State>()(set => ({
    ...state,
    dispatch: (action) => {
        set(state => {           
            const { domain, reducer } = resources(action.type);
        
            return {
                ...state,
                 // Fix: Since the action is a union type and the reducer is dynamically determined.
                 // The compiler complains about the all possible payloads not matching all possible
                 // arguments.
                [domain]: reducer.action(action.payload as any, state[domain] as any),
            };
        });
    },
}));

export { useStore, actions };