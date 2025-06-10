import { type ReactNode } from 'react';
import { MemoryRouter, Route,Routes } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import config from 'config';

import TopBar from './TopBar';

// === Mock Icons ===
vi.mock('components/UI/icons/Icons', () => ({
    SidebarOpen: () => <svg data-testid="open-sidebar-icon" />
}));

// === Mock Avatar component ===
vi.mock('components/UI/avatar/Avatar', () => ({
    default: ({ onClick }: { onClick: () => void }) => (
        <div data-testid="avatar" onClick={onClick}>Avatar</div>
    )
}));

// === Mock Button component ===
vi.mock('components/UI/button/Button', () => ({
    default: ({ onClick, icon, hidden }: { onClick: () => void; icon: ReactNode; hidden?: boolean }) => (
        <button onClick={onClick} data-testid="open-sidebar-btn" hidden={hidden}>
            {icon}
        </button>
    )
}));

// === Mock user-interface store selector ===
const useUserInterfaceSelectionMock = vi.hoisted(() =>
    vi.fn(() => ({
        isSidebarOpen: false,
    }))
);

vi.mock('store/selectors/ui', () => ({
    useUserInterfaceSelection: useUserInterfaceSelectionMock
}));

// === Mock user store selector ===
const clearUserMock = vi.hoisted(() => vi.fn());

vi.mock('store/selectors/user', () => ({
    useUserSelection: () => ({
        email: 'user@example.com',
        clearUser: clearUserMock
    })
}));

// === Mock logout API ===
const logoutMock = vi.hoisted(() => vi.fn());

vi.mock('api', () => ({
    default: {
        service: {
            resources: {
                authentication: {
                    logout: logoutMock
                }
            }
        }
    }
}));

/**
 * Renders the "TopBar" component into the JS-DOM.
 */
const renderTopBar = () => {
    render(
        <MemoryRouter initialEntries={[config.routes.root]}>
            <Routes>
                <Route path={config.routes.root} element={<TopBar />} />
                <Route path={config.routes.login} element={<h1>Login page</h1>} />
            </Routes>
        </MemoryRouter>
    );
};

describe('TopBar component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('open sidebar button is rendered when sidebar is closed', () => {
        renderTopBar();

        expect(screen.getByTestId('open-sidebar-btn')).toBeVisible();
        expect(screen.getByTestId('open-sidebar-icon')).toBeVisible();
    });

    it('open sidebar button is hidden when sidebar is open', () => {
         useUserInterfaceSelectionMock.mockReturnValue({
            isSidebarOpen: true
        });

        renderTopBar();

        expect(screen.getByTestId('open-sidebar-btn')).not.toBeVisible();
        expect(screen.getByTestId('open-sidebar-icon')).not.toBeVisible();
    });

    it('avatar component is rendered', () => {
        renderTopBar();

        expect(screen.queryByTestId('avatar')).toBeVisible();
    }); 

    it('logs out the user and shows the login screen', async () => {
        renderTopBar();

        // Open dropdown menu
        userEvent.click(screen.getByTestId('avatar'));

        // Click Logout option
        userEvent.click(screen.getByText('Logout'));

        await waitFor(() => {
            expect(logoutMock).toHaveBeenCalled();
            expect(clearUserMock).toHaveBeenCalled();
            expect(screen.getByRole('heading', { name: 'Login page' })).toBeInTheDocument();
        });
    });
});
