import { UserStore } from 'shared/types/store/store.user.types';
import { StateCreator } from 'zustand';

import { Store } from '../../store.types';
import initUser from './user.state';
import { UserSlice } from './user.types';

export const createUserSlice: StateCreator<Store, [], [], UserSlice> = (set) => ({
    ...initUser,
    changeUser: (user: UserStore) => set(() => (user)),
    clearUser: () => set(() => (initUser)),
});