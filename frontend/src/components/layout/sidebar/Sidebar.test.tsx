import { type ReactNode } from 'react';
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
const renderSidebar = (
    isSidebarOpen: boolean,
    initialRoute: string,
    additionalRoutes: { path: string; element: ReactNode }[] = []
) => {
    useUserInterfaceSelectionMock.mockReturnValue({
        isSidebarOpen,
        toggleSidebar: toggleSidebarMock
    });

    render(
        <MemoryRouter initialEntries={[initialRoute]}>
            <Routes>
                <Route path="*" element={<Sidebar />} />

                {additionalRoutes.map(({ path, element }) => (
                    <Route key={path} path={path} element={element} />
                ))}
            </Routes>
        </MemoryRouter>
    );
};

describe('Sidebar component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the sidebar and navigation items', () => {
        renderSidebar(true, '/');

        expect(screen.getByTestId('sidebar')).toBeInTheDocument();
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByTestId('icon-home')).toBeInTheDocument();
        expect(screen.getByTestId('icon-close')).toBeInTheDocument();
    });

    it('applies "open" class when "isSidebarOpen" is true', () => {
        renderSidebar(true, '/');

        const sidebar = screen.getByTestId('sidebar');
        expect(sidebar.className).toContain('open');
    });

    it('applies "close" class when "isSidebarOpen" is false', () => {
        renderSidebar(false, '/');

        const sidebar = screen.getByTestId('sidebar');
        expect(sidebar.className).toContain('close');
    });

    it('"aria-hidden" attribute value is false when "side-bar is open', () => {
        renderSidebar(true, '/');

        expect(screen.getByTestId('sidebar')).toHaveAttribute('aria-hidden', 'false');
    });

     it('"aria-hidden" attribute value is true when side-bar is closed', () => {
        renderSidebar(false, '/');

        expect(screen.getByTestId('sidebar')).toHaveAttribute('aria-hidden', 'true');
    });

    it('"toggleSidebar" is invoked when pressing the close-sidebar button', async () => {
        renderSidebar(true, '/');

        await userEvent.click(screen.getByTestId('close-sidebar-btn'));

        expect(toggleSidebarMock).toHaveBeenCalledTimes(1);
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
        expect(link?.className).not.toContain('linkActive');
        expect(link?.className).toContain('link');
    });

    it('renders corresponding view when nav link is clicked', async () => {
        renderSidebar(true, '/not-home', [
            { path: '/', element: <h1>Home View</h1> }
        ]);

        await userEvent.click(screen.getByText('Home'));

        expect(screen.getByRole('heading', { name: 'Home View' })).toBeInTheDocument();
    });
});