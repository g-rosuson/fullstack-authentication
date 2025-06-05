type Theme = 'dark' | 'light';

type UserInterface = {
    theme: Theme;
    isSidebarOpen: boolean;
};

interface UserInterfaceSlice extends UserInterface {
    changeTheme: (theme: Theme) => void;
    toggleSidebar: (isSidebarOpen: boolean) => void;
}

export type { UserInterface, UserInterfaceSlice, Theme };