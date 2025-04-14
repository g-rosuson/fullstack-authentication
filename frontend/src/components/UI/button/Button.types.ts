import { type MouseEventHandler, type ReactNode } from 'react';

export type Props = {
    children: ReactNode;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    hidden?: boolean;
    isLoading?: boolean;
    testId?: string;
}