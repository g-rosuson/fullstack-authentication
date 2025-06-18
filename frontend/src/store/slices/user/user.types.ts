type UserStore = {
    accessToken: string | null;
    email: string | null;
    id: string | null;
}

interface UserSlice extends UserStore {
    changeUser: (user: UserStore) => void;
    clearUser: () => void;
}

export type { UserSlice, UserStore };