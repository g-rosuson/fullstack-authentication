type Theme = 'dark' | 'light';

type UserInterface = {
    theme: Theme;
    isSidebarOpen: boolean;
};

interface UserInterfaceSlice extends UserInterface {
    toggleTheme: () => void;
    toggleSidebar: () => void;
}

export type { UserInterface, UserInterfaceSlice, Theme };