import { KeyboardEvent, ReactNode } from 'react';

type Action = {
    label: string;
    onClick: () => Promise<void> | void;
    // eslint-disable-next-line no-unused-vars
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