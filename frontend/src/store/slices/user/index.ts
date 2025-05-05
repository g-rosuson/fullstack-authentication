import { StateCreator } from 'zustand';

import { Store } from '../../store.types';
import initUser from './user.state';
import { User, UserSlice } from './user.types';

export const createUserSlice: StateCreator<Store, [], [], UserSlice> = (set) => ({
    ...initUser,
    changeUser: (newUser: User) =>
        set((state) => ({
            user: {
                ...state.user,
                ...newUser,
            }
        })),
    clearUser: () =>
        set((state) => ({
            user: {
                ...state.user,
                ...initUser,
            }
        })),
  });