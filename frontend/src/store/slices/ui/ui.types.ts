type Theme = 'dark' | 'light';

type UserInterface = {
    theme: Theme;
};

interface UserInterfaceSlice extends UserInterface {
    changeTheme: (theme: Theme) => void;
}

export type { UserInterface, UserInterfaceSlice, Theme };