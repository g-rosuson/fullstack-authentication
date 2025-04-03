import { fireEvent, render, screen, within } from '@testing-library/react';

import Avatar from './Avatar';
import { Props } from './Avatar.types';

/**
 * Renders the avatar with the given props into the JS-DOM and returns testing utilities.
 */
const setupAvatar = ({ email, onClick }: Props) => {
    return render(<Avatar email={email} onClick={onClick}/>);
};

describe('Avatar component', () => {
    let onClickMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        onClickMock = vi.fn();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('its a HTML button element', () => {
        setupAvatar({ email: 'email@domain.com', onClick: onClickMock });
        const avatarContainer = screen.getByTestId('avatar');
        expect(avatarContainer).toBeInstanceOf(HTMLButtonElement);
    });

    it('renders and capitalizes the first letter of the email', () => {
        setupAvatar({ email: 'email@domain.com', onClick: onClickMock });
        const avatarContainer = screen.getByTestId('avatar');
        const letter = within(avatarContainer).getByText('E');
        expect(letter).toHaveTextContent('E');
    });

    it('invokes the "onClick" callback function when clicked', () => {
        setupAvatar({ email: 'email@domain.com', onClick: onClickMock });
        const avatarContainer = screen.getByTestId('avatar');
        fireEvent.click(avatarContainer);
        expect(onClickMock).toHaveBeenCalledTimes(1);
    })
});