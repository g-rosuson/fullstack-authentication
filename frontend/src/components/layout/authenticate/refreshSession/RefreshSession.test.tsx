import { useState } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserState } from 'store/reducers/user/user.types';
import { afterAll, afterEach, beforeAll } from 'vitest'

import api from 'api';
import config from 'config';

import constants from './constants';
import RefreshSession from './RefreshSession';

/**
 * A parent root component that manages the "RefreshSession" modal state.
 */
const Root = () => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleModal = () => {
        setIsOpen(prevState => !prevState);
    };

    return (
        <div>
            <h2>Root route</h2>
            <RefreshSession open={isOpen} close={toggleModal} />
        </div>
    );
};

/**
 * Renders the "RefreshSession" component into the JS-DOM and returns testing utilities.
 */
const renderComponent = () => {
    return render(
        <MemoryRouter initialEntries={[config.routes.root]}>
            <Routes>
                <Route path={config.routes.root} element={<Root/>} />
                <Route path={config.routes.login} element={<div>Login page</div>}/>
            </Routes>
        </MemoryRouter>
    );
}

describe('RefreshSession modal component', () => {
    // Mock store
    const mockUserStore = vi.hoisted<UserState>(() => ({ 
        accessToken: null,
        email: '',
        id: ''
    }));

    const mockClearUserAction = vi.hoisted(() => 'user/clear_user');
    const mockChangeUserAction = vi.hoisted(() => 'user/change_user');
    const mockDispatch = vi.hoisted(() => vi.fn());

     vi.mock('../../../../store', async () => ({
        useStore: vi.fn(() => ({
            user: mockUserStore,
            dispatch: mockDispatch
        })),
        actions: {
            user: {
                clear_user: mockClearUserAction,
                change_user: mockChangeUserAction
            }
        }
    }));

    // Mock logout timeout duration
    const mockLogoutTimeout = constants.time.logoutTimeout;

    /**
     * Create the modal root for the "RefreshSessionModal" modal to be rendered into.
     */
    beforeAll(() => {
        const modalRoot = document.createElement('div');
        modalRoot.id = 'modal';
        document.body.appendChild(modalRoot);
    });

    /**
     * Reset mocked functions and variables after each test.
     */
    afterEach(() => {
        vi.clearAllMocks();
    });

    /**
     * Remove the modal root after all tests to ensure a clean test environment.
     */
    afterAll(() => {
        const modalRoot = document.getElementById('modal');

        if (modalRoot) {
            modalRoot.remove();
        }
    });

    it('initializes countdown to the correct value', () => {
        renderComponent();
    
        const countdownElement = screen.getByTestId('countdown');

        expect(countdownElement).toHaveTextContent(mockLogoutTimeout.toString());
    });

    it('decrements countdown every second', async () => {
        vi.useFakeTimers();
    
        renderComponent();
    
        const countdownElement = screen.getByTestId('countdown');
    
        // Simulate 1 second passing
        act(() => {
            vi.advanceTimersByTime(1000);
        });
    
        // Assert the countdown has decreased by 1 second
        expect(countdownElement).toHaveTextContent(`${mockLogoutTimeout - 1}`);
    
        // Simulate another second passing
        act(() => {
            vi.advanceTimersByTime(1000);
        });
    
    
        // Assert the countdown has decreased by 2 seconds
        expect(countdownElement).toHaveTextContent(`${mockLogoutTimeout - 2}`);
    
        vi.useRealTimers();
    });

    it('executes the logout flow when countdown reaches 0', async () => {
        vi.useFakeTimers();

        // Determine mock response and spy
        const mockResponse = {
            success: true,
            data: undefined,
            meta: {
                timestamp: new Date()
            }
        };
    
        const logoutSpy = vi.spyOn(api.service.resources.authentication, 'logout').mockResolvedValue(mockResponse);

        // Mock a truthy access token so the logout flow is executed
        mockUserStore.accessToken = 'access.token';
    
        renderComponent();
    
        // Simulate 90 seconds by advancing one second at
        // a time and ensuring React processes each tick
        for (let i = 0; i < mockLogoutTimeout; i++) {
            await act(async () => {
                vi.advanceTimersByTime(1000);
            });
        }

        // Assert logout was called
        expect(logoutSpy).toHaveBeenCalledOnce();

        // Assert that the dispatch function was called with the correct action
        expect(mockDispatch).toHaveBeenCalledWith({ type: mockClearUserAction });

        // Assert the user was redirected to the login page
        expect(screen.getByText('Login page')).toBeInTheDocument();
    
        vi.useRealTimers();
    });

    it('session is refreshed when user presses confirm and the modal automatically closes afterwards', async () => {
        renderComponent();
        
        const modal = screen.getByRole('dialog');

        // Determine mock response and spy
        const mockResponse = {
            success: true,
            data: {
                accessToken: 'access.token',
                email: 'email@example.com',
                id: '1234'
            },
            meta: {
                timestamp: new Date()
            }
        };

        const refreshSessionSpy = vi.spyOn(api.service.resources.authentication, 'refreshAccessToken').mockResolvedValue(mockResponse);
      
        // Simulate session refresh when confirm button is clicked
        const refreshSessionButton = within(modal).getByTestId('primary-button');
        await userEvent.click(refreshSessionButton);
    
        // Assert logout was called
        expect(refreshSessionSpy).toHaveBeenCalledOnce();

        // Assert store.dispatch function was called with the correct payload
        expect(mockDispatch).toHaveBeenCalledWith({
            payload: mockResponse.data,
            type: mockChangeUserAction
        });

        waitFor(() => {
            expect(modal).not.toBeInTheDocument();
        });
    }); 

    it('navigates to the login page when the renew session endpoint throws an error', async () => {
        renderComponent();

        const modal = screen.getByRole('dialog');

        const mockError = new Error('Refreshing token failed');
        const refreshSessionSpy = vi.spyOn(api.service.resources.authentication, 'refreshAccessToken').mockRejectedValue(mockError);

        // Simulate session refresh when confirm button is clicked
        await act(async () => {
            const refreshSessionButton = within(modal).getByTestId('primary-button');
            await userEvent.click(refreshSessionButton);
        });

        // Assert logout was called
        expect(refreshSessionSpy).toHaveBeenCalledOnce();

        // Assert store.dispatch function was called with the correct payload
        expect(mockDispatch).toHaveBeenCalledWith({ type: mockClearUserAction });

        // Assert the user was redirected to the login page
        expect(screen.getByText('Login page')).toBeInTheDocument();
    });
}); 