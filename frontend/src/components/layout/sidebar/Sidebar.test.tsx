import { type ReactElement } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Sidebar from './Sidebar';

// === Mock CSS Modules ===
vi.mock('./Sidebar.module.scss', () => ({
    default: {
        open: 'open',
        close: 'close',
        link: 'link',
        linkActive: 'linkActive'
    },
}));

// === Mock config ===
vi.mock('config', () => ({
    default: {
        routes: {
            root: '/',
        },
    },
}));

// === Mock Icons ===
vi.mock('components/UI/icons/Icons', () => ({
    SidebarClose: () => <svg data-testid="icon-close" />,
    Home: () => <svg data-testid="icon-home" />,
}));

// === Mock Button ===
vi.mock('components/UI/button/Button', () => ({
    default: ({ onClick, icon }: { onClick: () => void; icon: ReactElement }) => (
        <button onClick={onClick} data-testid="sidebar-toggle-btn">
            {icon}
        </button>
    ),
}));

// === Mock store ===
const toggleSidebarMock = vi.fn();
// Note: vi.mock is hoisted under the hood, therefore we
// need to hoist "useUserInterfaceSelectionMock" as well
const useUserInterfaceSelectionMock = vi.hoisted(() =>
    vi.fn(() => ({
        isSidebarOpen: true,
        toggleSidebar: toggleSidebarMock,
    }))
);

vi.mock('store/selectors/ui', () => ({
    useUserInterfaceSelection: useUserInterfaceSelectionMock,
}));

/**
 * Custom render helper that sets the sidebar open/close state
 * and allows specifying the current route.
 */
const renderSidebar = (isSidebarOpen = true, route = '/') => {
    useUserInterfaceSelectionMock.mockReturnValue({
        isSidebarOpen,
        toggleSidebar: toggleSidebarMock,
    });

    render(
        <MemoryRouter initialEntries={[route]}>
            <Routes>
                <Route path="*" element={<Sidebar />} />
            </Routes>
        </MemoryRouter>
    );
};


describe('Sidebar component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the sidebar and navigation items', () => {
        renderSidebar();

        expect(screen.getByTestId('sidebar')).toBeInTheDocument();
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByTestId('icon-home')).toBeInTheDocument();
        expect(screen.getByTestId('icon-close')).toBeInTheDocument();
    });

    it('applies "open" class when "isSidebarOpen" is true', () => {
        renderSidebar(true);

        const sidebar = screen.getByTestId('sidebar');
        expect(sidebar.className).toContain('open');
    });

    it('applies "close" class when "isSidebarOpen" is false', () => {
        renderSidebar(false);

        const sidebar = screen.getByTestId('sidebar');
        expect(sidebar.className).toContain('close');
    });

    it('"aria-hidden" attribute value is false when "isSidebarOpen" is true', () => {
        renderSidebar();

        expect(screen.getByTestId('sidebar')).toHaveAttribute('aria-hidden', 'false');
    });

     it('"aria-hidden" attribute value is true when "isSidebarOpen" is false', () => {
        renderSidebar(false);

        expect(screen.getByTestId('sidebar')).toHaveAttribute('aria-hidden', 'true');
    });

    it('"toggleSidebar" is invoked with false when pressing the close-sidebar button', async () => {
        renderSidebar();

        await userEvent.click(screen.getByTestId('sidebar-toggle-btn'));

        expect(toggleSidebarMock).toHaveBeenCalledWith(false);
    });

    it('applies "linkActive" class when route matches link', () => {
        // Set initial route to `/`, which matches the "Home" link
        renderSidebar(true, '/');

        const link = screen.getByText('Home').closest('a');
        expect(link?.className).toContain('linkActive');
    });

    it('applies "link" class when route does not match link', () => {
        // Set initial route to `/not-home`, which does NOT match "Home"
        renderSidebar(true, '/not-home');

        const link = screen.getByText('Home').closest('a');
        expect(link?.className).toContain('link');
    });
});
