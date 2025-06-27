import { ReactNode } from 'react';

import config from 'config';

const AppSetup = ({ children }: { children: ReactNode }) => {
    // Set backend URL on the global object
    const isDeveloping = window.location.hostname === 'localhost';
    const backendRootUrl = isDeveloping ? config.connect.backend.dev.url : config.connect.backend.prod.url;

    window.metadata = window.metadata ?? {};
    window.metadata.backendRootUrl = backendRootUrl;

    return children;
};

export default AppSetup;
