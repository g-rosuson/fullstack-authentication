import { ReactNode } from 'react';

type Action = {
    label: string;
    action: () => Promise<void> | void;
}

type Props = {
    open: boolean;
    close: () => void;
    actions: Action[];
    controller: ReactNode;
}

export type {
    Props
}