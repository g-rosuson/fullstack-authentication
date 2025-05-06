import { UserStore } from 'shared/types/store/store.user.types';

interface UserSlice extends UserStore {
    changeUser: (user: UserStore) => void;
    clearUser: () => void;
}

export type { UserSlice };