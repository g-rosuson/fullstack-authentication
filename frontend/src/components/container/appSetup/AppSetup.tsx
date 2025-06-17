import { ReactNode } from 'react';
import { useUserInterfaceSelection } from 'store/selectors/ui';

import config from 'config';
import storage from 'services/storage';


const AppSetup = ({ children }: { children: ReactNode}) => {
    // 1. Set theme in store and as the value of the data-theme root attribute,
    // to render corresponding CSS color palette

    // Store ui selector
    const uiStoreSelector = useUserInterfaceSelection();

    // Get persisted theme from local storage
    const persistedTheme = storage.getTheme();

    // Check if the system theme is dark
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // If the theme hasnt been persisted use the system preference
    const themeToApply = persistedTheme || (prefersDark ? 'dark' : 'light');

    // Set theme in store
    uiStoreSelector.changeTheme(themeToApply)

    // Set data-theme attribute value as the theme
    document.documentElement.setAttribute('data-theme', themeToApply);

    // 2. Add the relevant backend url to the window object
    const isDeveloping = window.location.hostname === 'localhost';

    const backendRootUrl = isDeveloping ? config.connect.backend.dev.url : config.connect.backend.prod.url;

    window.metadata = window.metadata ?? {};
    window.metadata.backendRootUrl = backendRootUrl;

    return children;
};

export default AppSetup;