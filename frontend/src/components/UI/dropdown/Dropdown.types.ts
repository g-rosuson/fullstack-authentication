import React, { ReactNode } from 'react';

type Action = {
    label: string;
    action: () => Promise<void> | void;
}

type Props = {
    open: boolean;
    close: () => void;
    actions: Action[];
    controller: ReactNode;
    position?: Pick<React.CSSProperties, 'top' | 'right' | 'bottom' | 'left'>;
}

export type {
    Props
}