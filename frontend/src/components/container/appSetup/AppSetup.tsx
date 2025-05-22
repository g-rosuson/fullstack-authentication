import { ReactNode } from 'react';

import config from 'config';

const AppSetup = ({ children }: { children: ReactNode}) => {
    const isDeveloping = window.location.hostname === 'localhost';

    // 1. Add the relevant backend url to the window object
    const backendRootUrl = isDeveloping ? config.connect.backend.dev.url : config.connect.backend.prod.url;

    // 2. Determine metadata
    window.metadata = window.metadata ?? {
        isDeveloping
    };

    window.metadata.backendRootUrl = backendRootUrl;

    return children;
};

export default AppSetup;