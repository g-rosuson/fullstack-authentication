import { Theme } from 'shared/types/theme';
import { StateCreator } from 'zustand';

import storage from 'services/storage';

import { Store } from '../../store.types';
import { UserInterfaceSlice } from './ui.types';

export const createUserInterfaceSlice: StateCreator<Store, [], [], UserInterfaceSlice> = (set) => {
    // * Initialize the store theme

    // Get persisted theme from local storage
    const persistedTheme = storage.getTheme();

    // Check if the system theme is dark
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // If no theme persisted, use system preference
    const themeToApply = persistedTheme || (prefersDark ? 'dark' : 'light');

    // Set data-theme attribute
    document.documentElement.setAttribute('data-theme', themeToApply);

    
    return {
        theme: themeToApply,
        isSidebarOpen: true,
        toggleSidebar: () => set(store => ({ 
            isSidebarOpen: !store.isSidebarOpen 
        })),
        changeTheme: (theme: Theme) => set(() => ({ theme }))
    }
};