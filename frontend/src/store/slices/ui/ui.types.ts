import { Theme } from 'types/theme';

type UserInterface = {
    theme: Theme;
    isSidebarOpen: boolean;
};

interface UserInterfaceSlice extends UserInterface {
    changeTheme: (theme: Theme) => void;
    toggleSidebar: () => void;
}

export type { UserInterface, UserInterfaceSlice, Theme };