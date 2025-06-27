import { Theme } from 'shared/types/theme';
import { StateCreator } from 'zustand';

import { Store } from '../../store.types';
import { UserInterfaceSlice } from './ui.types';

export const createUserInterfaceSlice: StateCreator<Store, [], [], UserInterfaceSlice> = (set) => {  
    return {
        theme: 'dark',
        isSidebarOpen: true,
        toggleSidebar: () => set(store => ({ isSidebarOpen: !store.isSidebarOpen })),
        changeTheme: (theme: Theme) => set(() => ({ theme }))
    }
};