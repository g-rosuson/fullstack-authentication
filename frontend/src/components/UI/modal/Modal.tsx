import React, { type FormEvent, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import Button from '../button/Button';
import { Cross } from '../icons/Icons';

import type { Props } from './Modal.types';

// eslint-disable-next-line css-modules/no-unused-class
import styling from './Modal.module.scss';

const modalRoot = document.getElementById('modal');

const Modal = (props: Props): React.ReactPortal => {
    // Deconstruct props
    const {
        open,
        close,
        children,
        formRef,
        size,
        dataAttributes,
        primaryAction,
        primaryLabel,
        secondaryAction,
        secondaryLabel,
        enableForm,
        isLoading,
        disabled,
        disableEscape = false,
        disableClose = false
    } = props;


    // Refs
    const element = useRef(document.createElement('div'));
    const backdrop = useRef<HTMLDivElement | null>(null);
    const modal = useRef<HTMLDivElement | null>(null);


    /**
     * Closes the modal with an animation if it's mounted;
     */
    const exit = (): void => {
        if (element.current.parentElement !== modalRoot || !modalRoot || !backdrop.current || !modal.current) {
            return;
        }

        backdrop.current?.classList.add(styling.fadeout);
        modal.current?.classList.add(styling.disappear);

        setTimeout(() => {
            (element.current.parentElement === modalRoot) && modalRoot.removeChild(element.current);
        }, 700);
    };


    /**
     * Handles form submits if the content of the modal is
     * rendered in a form. By this, we can use HTML
     * form validation.
     */
    const submitHandler = (event: FormEvent) => {
        event.preventDefault();
        primaryAction?.();
    };


    /**
     * Closes the modal if the escape key is pressed, and it
     * is currently visible.
     */
    useEffect(() => {
        const eventHandler = ({ key }: KeyboardEvent) => {
            if (key === 'Escape' && open && !disableEscape) {
                close?.();
            }
        };

        window.addEventListener('keydown', eventHandler, { passive: true });

        return () => {
            window.removeEventListener('keydown', eventHandler);
        };
    }, [close, open, disableEscape]);


    /**
     * Opens and closes the modal according to the open prop.
     */
    useEffect(() => {
        if (open) {
            backdrop.current?.classList.remove(styling.fadeout);
            modal.current?.classList.remove(styling.disappear);
            modalRoot?.appendChild(element.current);
        }

        return () => exit();

    }, [open]);


    // Determine modal styling
    let modalStyle = styling[size || 'm'];


    // Content of the modal
    let content = (
        <>
            {children}

            <div className={styling.buttonRow} hidden={!primaryAction && !secondaryAction}>
                <Button onClick={secondaryAction} hidden={!secondaryAction}>
                    {secondaryLabel}
                </Button>

                <Button onClick={primaryAction} isLoading={isLoading} disabled={disabled}>
                    {primaryLabel}
                </Button>
            </div>
        </>
    );


    // If the enableForm prop is true, the modal content
    // is wrapped in a form element to utilize HTML form
    // validation.
    if (enableForm) {
        content = (
            <form ref={formRef} onSubmit={submitHandler}>
                {children}

                <div className={styling.buttonRow} hidden={!primaryAction && !secondaryAction}>
                    <Button onClick={secondaryAction} hidden={!secondaryAction}>
                        {secondaryLabel}
                    </Button>

                    <Button type="submit" isLoading={isLoading} disabled={disabled}>
                        {primaryLabel}
                    </Button>
                </div>
            </form>
        );
    }


    // Component
    const component = (
        <div className={styling.backdrop} {...dataAttributes} ref={backdrop}>
            <div role="dialog" className={modalStyle} data-id="modal" ref={modal}>
                <button
                    className={styling.close}
                    onClick={disableClose ? undefined : close}
                    hidden={disableClose}
                >
                    <Cross thick/>
                </button>

                {content}
            </div>
        </div>
    );


    return createPortal(component, element.current);
};

export default Modal;