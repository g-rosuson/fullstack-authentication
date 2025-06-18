import { StateCreator } from 'zustand';

import { Store } from '../../store.types';
import ui from './ui.state';
import { Theme } from './ui.types';
import { UserInterfaceSlice } from './ui.types';

export const createUserInterfaceSlice: StateCreator<Store, [], [], UserInterfaceSlice> = (set) => ({
    ...ui,
    toggleSidebar: () => set(store => ({ 
        isSidebarOpen: !store.isSidebarOpen 
    })),
    changeTheme: (theme: Theme) => set(() => ({ theme }))
});