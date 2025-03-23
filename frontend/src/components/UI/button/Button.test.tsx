import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import Button from './Button';
import { Props } from './Button.types';

/**
 * Renders the button with the given props into the JS-DOM and returns testing utilities.
 */
const setupButton = (props: Partial<Props> = {}) => {
    return render((
        <Button testId='button' {...props}>
            Children
         </Button>
    ));
};

describe('Button component', () => {
    let onClickMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        onClickMock = vi.fn();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('its a HTML button element', () => {
        setupButton();
        const button = screen.getByTestId('button');
        expect(button).toBeInstanceOf(HTMLButtonElement);
    });

    // Test the "children" prop
    it('renders its children', () => {
        setupButton();
        const button = screen.getByTestId('button');
        const children = within(button).getByText('Children');
        expect(children).toHaveTextContent('Children');
    });

    // Test the "disabled" prop
    it('is disabled when "disabled" is true', () => {
        setupButton({ disabled: true });
        const button = screen.getByTestId('button');
        expect(button).toBeDisabled();
    });

    it('is enabled when "disabled" is false', () => {
        setupButton({ disabled: false });
        const button = screen.getByTestId('button');
        expect(button).not.toBeDisabled();
    });

    it('is enabled when "disabled" is undefined', () => {
        setupButton();
        const button = screen.getByTestId('button');
        expect(button).not.toBeDisabled();
    });

    // Test the "hidden" prop
    it('is hidden when "hidden" is true', () => {
        setupButton({ hidden: true });
        const button = screen.getByTestId('button');
        expect(button).not.toBeVisible();
    });

    it('is visible when "hidden" is false', () => {
        setupButton({ hidden: false });
        const button = screen.getByTestId('button');
        expect(button).toBeVisible();
    });

    it('is visible when "hidden" is undefined', () => {
        setupButton();
        const button = screen.getByTestId('button');
        expect(button).toBeVisible();
    });

    // Test the "isLoading" prop
    it('shows spinner when "isLoading" is true', () => {
        setupButton({ isLoading: true });
        const spinner = screen.getByTestId('spinner');
        expect(spinner).toBeInTheDocument();
    });

    it('does not render children when "isLoading" is true', () => {
        setupButton({ isLoading: true });
        const button = screen.getByTestId('button');
        expect(within(button).queryByText('Children')).not.toBeInTheDocument();
    });

    it('does not invoke the "onClick" callback function when "isLoading" is true', () => {
        setupButton({ isLoading: true, onClick: onClickMock });
        const button = screen.getByTestId('button');
        fireEvent.click(button);
        expect(onClickMock).not.toHaveBeenCalled();
    });

    it('invokes the "onClick" callback function when "isLoading" is false', () => {
        setupButton({ isLoading: false, onClick: onClickMock });
        const button = screen.getByTestId('button');
        fireEvent.click(button);
        expect(onClickMock).toHaveBeenCalledTimes(1);
    });

    it('invokes the "onClick" callback function when "isLoading" is undefined', () => {
        setupButton({ onClick: onClickMock });
        const button = screen.getByTestId('button');
        fireEvent.click(button);
        expect(onClickMock).toHaveBeenCalledTimes(1);
    });

    // Test the "type" prop
    it('applies the "type" prop correctly', () => {
        setupButton({ type: 'submit' });
        const button = screen.getByTestId('button');
        expect(button).toHaveProperty('type', 'submit');
    });

    it('submits the form when type="submit"', () => {
        const handleSubmitMock = vi.fn();

        render(
            <form onSubmit={handleSubmitMock}>
                <Button type="submit" testId="button">Submit</Button>
            </form>
        );

        const button = screen.getByTestId('button');
        fireEvent.click(button);
        expect(handleSubmitMock).toHaveBeenCalledTimes(1);
    });
});