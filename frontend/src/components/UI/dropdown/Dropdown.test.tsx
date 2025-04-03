import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Dropdown from './Dropdown';
import { Props } from './Dropdown.types';

/**
 * Renders the dropdown with the given props into the JS-DOM and returns the props.
 */
const setupDropdown = (props: Partial<Props> = {}) => {
  const tmpProps: Props = {
    open: false,
    close: vi.fn(),
    actions: [
      { label: 'Action 1', onClick: vi.fn(), onKeyDown: vi.fn() },
      { label: 'Action 2', onClick: vi.fn(), onKeyDown: vi.fn() },
    ],
    controller: <button>Open Menu</button>,
    ...props,
  };

  render(<Dropdown {...tmpProps} />);
  return tmpProps;
};


describe('Dropdown component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the dropdown when open is true', () => {
    setupDropdown({ open: true });
    expect(screen.getByRole('menu')).toBeVisible();
  });

  it('hides the dropdown when open is false', () => {
    setupDropdown({ open: false });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('calls the close function when clicking outside the dropdown', async () => {
    const props = setupDropdown({ open: true });

    // Simulate clicking outside
    await userEvent.click(document.body);

    expect(props.close).toHaveBeenCalledTimes(1);
  });

  it('does not call the close function when clicking inside the dropdown', async () => {
    const props = setupDropdown({ open: true });

    // Simulate clicking the controller or menu
    await userEvent.click(screen.getByRole('menu'));

    expect(props.close).not.toHaveBeenCalled();
  });

  it('triggers the correct action on click', async () => {
    const props = setupDropdown({ open: true });

    // Simulate click on first action
    await userEvent.click(screen.getByText('Action 1'));
    expect(props.actions[0].onClick).toHaveBeenCalledTimes(1);

    // Simulate click on second action
    await userEvent.click(screen.getByText('Action 2'));
    expect(props.actions[1].onClick).toHaveBeenCalledTimes(1);
  });

  it('supports keyboard navigation using Enter and Space', async () => {
    const props = setupDropdown({ open: true });

    const firstItem = screen.getByText('Action 1');
    firstItem.focus();

    // Simulate Enter key
    await userEvent.keyboard('{Enter}');
    expect(props.actions[0].onKeyDown).toHaveBeenCalledTimes(1);

    // Simulate Space key
    await userEvent.keyboard('{ }');
    expect(props.actions[0].onKeyDown).toHaveBeenCalledTimes(2);
  });

  it('has correct accessibility attributes', () => {
    setupDropdown({ open: true });
    const menu = screen.getByRole('menu');
    expect(menu).toHaveAttribute('aria-expanded', 'true');
    expect(menu).toHaveAttribute('aria-label', 'User menu');
  });
});