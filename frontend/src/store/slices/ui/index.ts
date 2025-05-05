import { StateCreator } from 'zustand';

import { Store } from '../../store.types';
import ui from './ui.state';
import { Theme, UserInterfaceSlice } from './ui.types';

export const createUserInterfaceSlice: StateCreator<Store, [], [], UserInterfaceSlice> = (set) => ({
    ...ui,
    changeTheme: (theme: Theme) =>
        set((store) => ({
            ui: {
                ...store.ui,
                theme,
            }
        }))
  });