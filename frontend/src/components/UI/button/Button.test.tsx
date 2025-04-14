import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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
        const { getByRole } = setupButton();
        expect(getByRole('button')).toBeInstanceOf(HTMLButtonElement);
    });

    // Test the "aria-disabled" attribute
    it('sets "aria-disabled" to true when the disabled prop is true', () => {
        const { getByRole } = setupButton({ disabled: true });
        expect(getByRole('button')).toHaveAttribute('aria-disabled', 'true');
    });

    it('sets "aria-disabled" to true when the isLoading prop is true', () => {
        const { getByRole } = setupButton({ isLoading: true });
        expect(getByRole('button')).toHaveAttribute('aria-disabled', 'true');
    });

    // Test the "aria-busy" attribute
    it('sets "aria-busy" to true when the isLoading prop is true', () => {
        const { getByRole } = setupButton({ isLoading: true });
        expect(getByRole('button')).toHaveAttribute('aria-busy', 'true');
    });

    it('sets "aria-busy" to false when the isLoading prop is false', () => {
        const { getByRole } = setupButton({ isLoading: false });
        expect(getByRole('button')).toHaveAttribute('aria-busy', 'false');
    });

    // Test the "aria-hidden" attribute
    it('sets "aria-hidden" to true when the hidden prop is true', () => {
        const { container } = setupButton({ hidden: true });
        const button = container.querySelector('button');
        expect(button).toHaveAttribute('aria-hidden', 'true');
    });

    it('sets "aria-hidden" to false when the hidden prop is false', () => {
        const { getByRole } = setupButton({ hidden: false });
        expect(getByRole('button')).toHaveAttribute('aria-hidden', 'false');
    });

    // Test the "children" prop
    it('renders its children', () => {
        const { getByRole } = setupButton();
        const button = getByRole('button');
        const children = within(button).getByText('Children');
        expect(children).toHaveTextContent('Children');
    });

    // Test the "disabled" prop
    it('is disabled when "disabled" is true', () => {
        const { getByRole } = setupButton({ disabled: true });
        expect(getByRole('button')).toBeDisabled();
    });

    it('is enabled when "disabled" is false', () => {
        const { getByRole } = setupButton({ disabled: false });
        expect(getByRole('button')).not.toBeDisabled();
    });

    it('is enabled when "disabled" is undefined', () => {
        const { getByRole } = setupButton();
        expect(getByRole('button')).not.toBeDisabled();
    });

    // Test the "hidden" prop
    it('is hidden when "hidden" is true', () => {
        const { queryByRole } = setupButton({ hidden: true });
        expect(queryByRole('button')).toBeNull();
    });

    it('is visible when "hidden" is false', () => {
        const { getByRole } = setupButton({ hidden: false });
        expect(getByRole('button')).toBeVisible();
    });

    it('is visible when "hidden" is undefined', () => {
        const { getByRole } = setupButton();
        expect(getByRole('button')).toBeVisible();
    });

    // Test the "isLoading" prop
    it('shows spinner when "isLoading" is true', () => {
        const { container } = setupButton({ isLoading: true });
        const spinner = within(container).getByTestId('spinner');
        expect(spinner).toBeInTheDocument();
    });

    it('does not render children when "isLoading" is true', () => {
        const { container } = setupButton({ isLoading: true });
        expect(within(container).queryByText('Children')).toBeNull();
    });

    it('does not invoke the "onClick" callback function when "isLoading" is true', async () => {
        const { getByRole } = setupButton({ isLoading: true, onClick: onClickMock });
        await userEvent.click(getByRole('button'));
        expect(onClickMock).not.toHaveBeenCalled();
    });

    it('invokes the "onClick" callback function when "isLoading" is false', async () => {
        const { getByRole } = setupButton({ isLoading: false, onClick: onClickMock });
        await userEvent.click(getByRole('button'));
        expect(onClickMock).toHaveBeenCalledTimes(1);
    });

    it('invokes the "onClick" callback function when "isLoading" is undefined', async () => {
        const { getByRole } = setupButton({ onClick: onClickMock });
        await userEvent.click(getByRole('button'));
        expect(onClickMock).toHaveBeenCalledTimes(1);
    });

    // Test the "type" prop
    it('applies the "type" prop correctly', () => {
        const { getByRole } = setupButton({ type: 'reset' });
        expect(getByRole('button')).toHaveProperty('type', 'reset');
    });

    it('submits the form when type="submit"', async () => {
        const handleSubmitMock = vi.fn();

        render(
            <form onSubmit={handleSubmitMock}>
                <Button type="submit">Submit</Button>
            </form>
        );

        await userEvent.click(screen.getByRole('button'));
        expect(handleSubmitMock).toHaveBeenCalledTimes(1);
    });
});