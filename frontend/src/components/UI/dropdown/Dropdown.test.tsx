import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import Dropdown from './Dropdown';

describe('Dropdown Component', () => {
    const mockClose = vi.fn();
    const mockActions = [
        { label: 'Action 1', onClick: vi.fn(), onKeyDown: vi.fn() },
        { label: 'Action 2', onClick: vi.fn(), onKeyDown: vi.fn() },
    ];

    it('renders controller and menu correctly', () => {
        render(<Dropdown open={true} close={mockClose} actions={mockActions} controller={<button>Open Menu</button>} />);

        expect(screen.getByRole('menu')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Open Menu' })).toBeInTheDocument();
        expect(screen.getByText('Action 1')).toBeInTheDocument();
        expect(screen.getByText('Action 2')).toBeInTheDocument();
    });

    it('calls close when clicking outside', async () => {
        render(<Dropdown open={true} close={mockClose} actions={mockActions} controller={<button>Open Menu</button>} />);

        await userEvent.click(document.body);

        expect(mockClose).toHaveBeenCalledTimes(1);
    });

    it('calls action onClick when an item is clicked', async () => {
        render(<Dropdown open={true} close={mockClose} actions={mockActions} controller={<button>Open Menu</button>} />);

        const actionItem = screen.getByText('Action 1');
        await userEvent.click(actionItem);

        expect(mockActions[0].onClick).toHaveBeenCalledTimes(1);
    });

    it('does not render menu when open is false', () => {
        render(<Dropdown open={false} close={mockClose} actions={mockActions} controller={<button>Open Menu</button>} />);

        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
});
