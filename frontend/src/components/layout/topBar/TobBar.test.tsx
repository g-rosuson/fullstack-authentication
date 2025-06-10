import { type ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

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

/**
 * Renders the "TopBar" component into the JS-DOM.
 */
const renderTopBar = () => {
    render(
        <MemoryRouter>
            <TopBar />
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
});
