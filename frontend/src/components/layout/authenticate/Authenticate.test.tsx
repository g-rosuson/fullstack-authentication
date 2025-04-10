import { act } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, Mock } from 'vitest'

import api from 'api';
import config from 'config';

import { UserState } from '../../../store/reducers/user/user.types';
import Authenticate from './Authenticate';

/**
 * Renders the "Authenticated" component into the JS-DOM and returns testing utilities.
 */
const renderComponent = () => {
    return render (
        <MemoryRouter initialEntries={[config.routes.root]}>
            <Routes>
                <Route element={<Authenticate/>}>
                    <Route path={config.routes.root} element={<div>Protected route</div>} />
                </Route>
               
                <Route path={config.routes.login} element={<div>Login page</div>} />
            </Routes>
        </MemoryRouter>
    );
}

describe('Authenticate component', () => {
    // Hoist mock variables since vi.mock is hoisted under the hood
    const mockUserStore = vi.hoisted<UserState>(() => ({ 
        accessToken: null,
        email: '',
        id: ''
    }));
    const mockDispatch = vi.hoisted(() => vi.fn());
    const mockErrorLogging = vi.hoisted(() => vi.fn());

    // Mock store
    vi.mock('../../../store', async () => ({
        useStore: vi.fn(() => ({
            user: { 
                accessToken: mockUserStore.accessToken,
                email: mockUserStore.email,
                id: mockUserStore.id
            },
            dispatch: mockDispatch
        })),
        actions: {
            user: {
                change_user: 'user/change_user',
            }
        }
    }));

    // Mock api
    vi.mock('../../../api', () => ({
        // Default exported modules should be wrapped in a "default" object
        // https://vitest.dev/api/vi.html#vi-mock
        default: {
            service: {
                resources: {
                    authentication: {
                        refreshAccessToken: vi.fn(),
                    }
                }
            }
        }
    }));

    // Mock logging service
    vi.mock('../../../services/logging', () => ({
        default: {
            error: mockErrorLogging
        }
    }));

    // Mock JWT service
    vi.mock('../../../utils/jwt', () => ({
        default: {
            decode: vi.fn(() => ({
                // Mock JWT expiration time to be 5 seconds in the future
                exp: Math.floor((Date.now() + 5000) / 1000)
            }))
        }
    }));

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
        mockUserStore.accessToken = null;   
        mockUserStore.email = '';
        mockUserStore.id = '';
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

    it('renders authenticated component when access token is successfully refreshed', async () => {
        // Mock successful API response
        const mockUserResponseData = {
            accessToken: 'mockAccessToken',
            email: 'email@example.com',
            id: 'user-1',
        };
    
        (api.service.resources.authentication.refreshAccessToken as Mock).mockResolvedValue({
            data: mockUserResponseData,
        });

        renderComponent();
    
        // Assert that:
        // - The store.dispatch function was called with the correct payload
        // - The user was redirected to the protected route
        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith({
                payload: mockUserResponseData,
                type: 'user/change_user'
            });

            expect(screen.getByText('Protected route')).toBeInTheDocument();
        });
    });

    it('does not call "refreshAccessToken" endpoint when accessToken is set', async () => {
        mockUserStore.accessToken = 'valid.jwt.token';
    
        renderComponent();
    
        await waitFor(() => {
            expect(screen.getByText('Protected route')).toBeInTheDocument();
            expect(api.service.resources.authentication.refreshAccessToken).not.toHaveBeenCalled();
        });
    });
    

    it('navigates to "/login" route when the "refreshAccessToken" endpoints throws an error', async () => {
        const mockError = new Error('Refreshing token failed');
        (api.service.resources.authentication.refreshAccessToken as Mock).mockRejectedValue(mockError);
  
        renderComponent();

        // Assert that:
        // - Error was logged
        // - The user was redirected to the login page
        await waitFor(() => {
            expect(mockErrorLogging).toHaveBeenCalledWith(mockError);
            expect(screen.getByText('Login page')).toBeInTheDocument();
        });
    });    

    it('opens the refresh session modal when the access token is expired', async () => {
        // Inform vitest we use mocked time
        vi.useFakeTimers();

        // Mock a truthy access token so the useEffect hook runs
        mockUserStore.accessToken = 'access.token';
      
        renderComponent();
       
        await act(async () => {
            vi.advanceTimersByTime(5000);
        });

        expect(screen.getByRole('dialog')).toBeInTheDocument();

        vi.useRealTimers();
    });
});
