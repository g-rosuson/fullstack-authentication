import { StateCreator } from 'zustand';

import { Store } from '../../store.types';
import ui from './ui.state';
import { UserInterfaceSlice } from './ui.types';

export const createUserInterfaceSlice: StateCreator<Store, [], [], UserInterfaceSlice> = (set) => ({
    ...ui,
    toggleTheme: () => set((store) => {
        const isDark = store.theme === 'dark';
        const theme = isDark ? 'light' : 'dark'

        return { theme };
    }),
    toggleSidebar: () => set((store) => ({ 
        isSidebarOpen: !store.isSidebarOpen 
    }))
});