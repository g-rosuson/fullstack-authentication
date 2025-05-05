type User = {
    accessToken: string | null;
    email: string | null;
    id: string | null;
}

interface UserSlice extends User {
    changeUser: (user: User) => void;
    clearUser: () => void;
}

export type { User, UserSlice }