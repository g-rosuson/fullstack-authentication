import { KeyboardEvent, ReactNode } from 'react';

type Action = {
    label: string;
    onClick: () => Promise<void> | void;
    onKeyDown: (event: KeyboardEvent) => Promise<void> | void;
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