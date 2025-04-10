import { type FormEvent, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import Button from '../button/Button';
import { Cross } from '../icons/Icons';

import type { Props } from './Modal.types';

// eslint-disable-next-line css-modules/no-unused-class
import styling from './Modal.module.scss';

const Modal = (props: Props) => {
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
    const modalRoot = useRef<HTMLElement | null>(null);
    const element = useRef(document.createElement('div'));
    const backdrop = useRef<HTMLDivElement | null>(null);
    const modal = useRef<HTMLDivElement | null>(null);


    /**
     * Adds animation CSS classes to the backdrop and modal when the modal is closed.
     * And removes the modal from the DOM after the animation has completed.
     */
    const exit = (): void => {
        if (element.current.parentElement !== modalRoot.current || !modalRoot.current || !backdrop.current || !modal.current) {
            return;
        }

        backdrop.current?.classList.add(styling.fadeout);
        modal.current?.classList.add(styling.disappear);

        setTimeout(() => {
            (element.current.parentElement === modalRoot.current) && modalRoot.current?.removeChild(element.current);
        }, 700);
    };


    /**
     * Handles form submission when "enableForm" is true. By preventing
     * the form being reset on submission and calling the "primaryAction"
     * callback function.
     */
    const onFormSubmit = (event: FormEvent) => {
        event.preventDefault();
        primaryAction?.();
    };


    /**
     * Adds a "keydown" event listener, that calls the "close" callback
     * function when "Escape" is pressed. With the expection of either
     * "disableClose" or "disableEscape" props being true.
     */
    useEffect(() => {
        const eventHandler = ({ key }: KeyboardEvent) => {
            const pressedEscape = key === 'Escape';

            const isEscapeDisabled = disableClose || disableEscape;

            if (open && pressedEscape && !isEscapeDisabled) {
                close?.();
            }
        };

        window.addEventListener('keydown', eventHandler, { passive: true });

        return () => {
            window.removeEventListener('keydown', eventHandler);
        };
    }, [open, close, disableEscape, disableClose]);


    /**
     * Removes the "fadeout" class from the backdrop element and the "disappear"
     * class from the modal element when the modal is open. And adds the modal 
     * to the DOM when the modal is open.
     */
    useEffect(() => {
        if (open) {
            modalRoot.current = document.getElementById('modal');
            backdrop.current?.classList.remove(styling.fadeout);
            modal.current?.classList.remove(styling.disappear);
            modalRoot.current?.appendChild(element.current);
        }

        return () => exit();

    }, [open]);


    // Determine modal styling
    let modalStyle = styling[size || 'm'];


    // Determine button container
    const buttonContainer = (
        <div 
            className={styling.buttonRow}
            data-testid="button-container"
            hidden={!primaryAction && !secondaryAction}
        >
            <Button 
                onClick={secondaryAction} 
                hidden={!secondaryAction}
                testId='secondary-button'
            >
                {secondaryLabel}
            </Button>

            <Button
                // Set the button type to "submit" when the form is enabled
                type={enableForm ? 'submit' : undefined}
                testId='primary-button'
                // Pass the "primaryAction" callback to the onClick when not using the form
                onClick={enableForm ? undefined : primaryAction}
                isLoading={isLoading}
                disabled={disabled || !primaryAction}
            >
                {primaryLabel}
            </Button>
        </div>
    );


    // Determine modal content without a form
    let content = (
        <>
            {children}
            {buttonContainer}
        </>
    );


    // Determine a modal wrapped in a form tag and enable HTML form validation
    if (enableForm) {
        content = (
            <form ref={formRef} data-testid="form" onSubmit={onFormSubmit}>
                {children}
                {buttonContainer}
            </form>
        );
    }


    const component = (
        <div className={styling.backdrop} {...dataAttributes} ref={backdrop}>
            <div
                role="dialog"
                className={modalStyle}
                data-testid="modal"
                data-id="modal"
                ref={modal}
            >
                <button
                    className={styling.close}
                    data-testid="close-button"
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