import { StateCreator } from 'zustand';

import { Store } from '../../store.types';
import initUser from './user.state';
import { User, UserSlice } from './user.types';

export const createUserSlice: StateCreator<Store, [], [], UserSlice> = (set) => ({
    ...initUser,
    changeUser: (user: User) => set(() => ({ ...user })),
    clearUser: () => set(() => ({ ...initUser })),
});