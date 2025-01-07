import { ReactNode } from 'react';

const AppSetup = ({ children }: { children: ReactNode}) => {
    const isDeveloping = window.location.hostname === 'localhost';

    // 1. Add the relevant backend url to the window object
    const backendRootUrl = isDeveloping ? 'http://localhost:1000' : 'https://my-url';

    window.metadata = window.metadata ?? {};
    window.metadata.backendRootUrl = backendRootUrl;

    return children;
};

export default AppSetup;