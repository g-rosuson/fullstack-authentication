import type { ReactNode, RefObject } from 'react';

type DataAttributes = Record<`data-${string}`, string>

type ClickHandler = () => Promise<void> | void;

export type Props = {
    open: boolean;
    close?: () => void;
    children: ReactNode;
    size?: 's' | 'm' | 'l' | 'xl';
    primaryAction?: ClickHandler;
    primaryLabel?: string;
    secondaryAction?: ClickHandler;
    secondaryLabel?: string;
    enableForm?: boolean;
    isLoading?: boolean;
    disabled?: boolean;
    hideOverflow?: boolean;
    disableEscape?: boolean;
    formRef?: RefObject<HTMLFormElement>;
    className?: string;
    dataAttributes?: DataAttributes;
}