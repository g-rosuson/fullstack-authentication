import { ReactNode } from 'react';

import styling from './Content.module.scss';

const Content = ({ children }: { children: ReactNode}) => {
    return (
        <div className={styling.container}>
            {children}
        </div>
    );
};

export default Content;