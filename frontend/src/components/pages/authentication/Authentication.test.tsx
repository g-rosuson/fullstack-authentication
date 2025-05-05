import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, Mock } from 'vitest'

import api from 'api';
import config from 'config';

import { User } from '../../../store/slices/user/user.types';
import Authentication from './Authentication';

/**
 * Renders the authentication component wrapped in a testing router
 * with the given path into the JS-DOM and returns testing utilities.
 */
const renderComponent = (path: string) => {
    return render(
        <MemoryRouter initialEntries={[path]}>
            <Authentication />
        </MemoryRouter>
    );
};

describe('Authentication component: authentication', () => {
    // Mock user store and hoist variables since vi.mock is hoisted by default
     const mockUser = vi.hoisted<User>(() => ({
        accessToken: null,
        email: null,
        id: null,
    }));
    const mockChangeUser = vi.hoisted(() => vi.fn());
    const mockClearUser = vi.hoisted(() => vi.fn());
    const mockErrorLogging = vi.hoisted(() => vi.fn());

    vi.mock('../../../store', async () => ({
        useStore: vi.fn(() => ({
            user: { 
                ...mockUser,
                changeUser: mockChangeUser, 
                clearUser: mockClearUser
             }
        }))
    }));

    // Mock api
    vi.mock('../../../api', () => ({
        // Default exported modules should be wrapped in a "default" object
        // https://vitest.dev/api/vi.html#vi-mock
        default: {
            service: {
                resources: {
                    authentication: {
                        login: vi.fn(),
                        register: vi.fn()
                    }
                }
            }
        }
    }));

    // Mock utils.jwt to always return true so we can test
    // the navigation to the root route
    vi.mock('../../../utils/jwt', () => ({
        default: {
            isValid: vi.fn(() => true),
        }
    }));

    // Mock logging service
    vi.mock('../../../services/logging', () => ({
        default: {
            error: mockErrorLogging
        }
    }));

    // Mock variables
    const mockAccessToken = 'mockAccessToken';
    const mockPassword = 'password123';
    const mockEmail = 'email@example.com';
    const mockId = '123';

    afterEach(() => {
        vi.clearAllMocks();
        mockUser.accessToken = null;
    });

    // Test dynamic login and register endpoint invocations
    it('login endpoint is invoked with correct values when the "/login" route is active', async () => {
        renderComponent(config.routes.login);

        // Mock API response to prevent dispatch payload causing errors
        (api.service.resources.authentication.login as Mock).mockResolvedValue({ data: {} });

        // Simulate user input
        await userEvent.type(screen.getByTestId('email-input'), mockEmail);
        await userEvent.type(screen.getByTestId('password-input'), mockPassword);
        await userEvent.click(screen.getByTestId('auth-submit-button'));

        // Assert that the login function was called with the correct arguments
        await waitFor(() => {
            expect(api.service.resources.authentication.login).toHaveBeenCalledWith({
                email: mockEmail,
                password: mockPassword,
            });
        });
    });

    it('register endpoint is invoked with correct values when the "/register" route is active', async () => {
        renderComponent(config.routes.register);

        // Mock API response to prevent dispatch payload causing errors
        (api.service.resources.authentication.register as Mock).mockResolvedValue({
            data: {
                accessToken: mockAccessToken,
                email: mockEmail,
                id: mockId,
            }
        });

        // Simulate user input
        await userEvent.type(screen.getByTestId('email-input'), mockEmail);
        await userEvent.type(screen.getByTestId('password-input'), mockPassword);
        await userEvent.click(screen.getByTestId('auth-submit-button'));

        // Assert that the register function was called with the correct arguments
        await waitFor(() => {
            expect(api.service.resources.authentication.register).toHaveBeenCalledWith({
                email: mockEmail,
                password: mockPassword,
            });
        });
    });

    // Test that the changeUser function is called with the correct payload
    it('store.user.changeUser is called with correct arguments during authentication', async () => {
        renderComponent(config.routes.login);

        // Determine the mock response from the login function in the <Authentication/> component
        (api.service.resources.authentication.login as Mock).mockResolvedValue({
            data: {
                accessToken: mockAccessToken,
                email: mockEmail,
                id: mockId,
            }
        });

        // Mock user input & submission
        await userEvent.type(screen.getByTestId('email-input'), mockEmail);
        await userEvent.type(screen.getByTestId('password-input'), mockPassword);
        await userEvent.click(screen.getByTestId('auth-submit-button'));

        // Assert that the dispatch function was called with the correct payload
        await waitFor(() => {
            expect(mockChangeUser).toHaveBeenCalledWith({
                accessToken: mockAccessToken,
                email: mockEmail,
                id: mockId
            });
        });
    });

    it('navigates to the root when an "accessToken" is set and valid', async () => {
        const renderWithRoutes = () => {
            render (
                <MemoryRouter initialEntries={[config.routes.login]}>
                    <Routes>
                        <Route path={config.routes.login} element={<Authentication />} />
                        <Route path={config.routes.root} element={<div data-testid="home-page">Home Page</div>} />
                    </Routes>
                </MemoryRouter>
            );
        };

        renderWithRoutes();

        // Simulate a valid token being set
        mockUser.accessToken = 'valid-token';

        // Re-render to trigger useEffect with the new token
        renderWithRoutes();

        // Check if navigation occurred
        await waitFor(() => {
            expect(screen.getByTestId('home-page')).toBeInTheDocument();
        });
    });

    it('login failure is handled gracefully', async () => {
        renderComponent(config.routes.login);

        // Mock login failure
        const mockError = new Error('Login failed');
        (api.service.resources.authentication.login as Mock).mockRejectedValue(mockError);

        // Fill form and submit
        await userEvent.type(screen.getByTestId('email-input'), mockEmail);
        await userEvent.type(screen.getByTestId('password-input'), mockPassword);
        await userEvent.click(screen.getByTestId('auth-submit-button'));

        // Assert that:
        // - Error was logged
        // - The user is still on the login page
        // - The store.dispatch function was not called
        await waitFor(() => {
            expect(mockErrorLogging).toHaveBeenCalledWith(mockError);
            expect(screen.getByRole('heading')).toHaveTextContent(/login/i);
            expect(mockChangeUser).not.toHaveBeenCalled();
        });
    });

    it('register failure is handled gracefully', async () => {
        renderComponent(config.routes.register);

        // Mock login failure
        const mockError = new Error('Registration failed');
        (api.service.resources.authentication.register as Mock).mockRejectedValue(mockError);

        // Fill form and submit
        await userEvent.type(screen.getByTestId('email-input'), mockEmail);
        await userEvent.type(screen.getByTestId('password-input'), mockPassword);
        await userEvent.click(screen.getByTestId('auth-submit-button'));

        // Assert that:
        // - Error was logged
        // - The user is still on the register page
        // - The store.dispatch function was not called
        await waitFor(() => {
            expect(mockErrorLogging).toHaveBeenCalledWith(mockError);
            expect(screen.getByRole('heading')).toHaveTextContent(/register/i);
            expect(mockChangeUser).not.toHaveBeenCalled();
        });
    });
});

describe('Authentication component: UI & navigation', () => {
    // Test title
    it('heading is a <h2> tag', () => {
        renderComponent(config.routes.login);
        const heading = screen.getByRole('heading', { level: 2 });
        expect(heading).toBeInTheDocument();
    });

    it('heading is "Register" when the register route is active', () => {
        renderComponent(config.routes.register);
        const heading = screen.getByRole('heading');
        expect(heading.textContent).toBe('Register');
    });

    it('heading is "Login" when the login route is active', () => {
        renderComponent(config.routes.login);
        const heading = screen.getByRole('heading');
        expect(heading.textContent).toBe('Login');
    });

    // Test form
    it('form is a <form> tag', () => {
        renderComponent(config.routes.login);
        const form = screen.getByTestId('auth-form');
        expect(form.tagName).toBe('FORM');
        expect(form).toBeInTheDocument();
    });

    it('form contains a required email input element', () => {
        renderComponent(config.routes.login);
        const form = screen.getByTestId('auth-form');
        const emailInput = within(form).getByTestId('email-input');
        expect(emailInput).toHaveAttribute('required');
    });

    it('form contains a required password input element', () => {
        renderComponent(config.routes.login);
        const form = screen.getByTestId('auth-form');
        const passwordInput = within(form).getByTestId('password-input');
        expect(passwordInput).toHaveAttribute('required');
    });

    it('contains a form with a submit button', () => {
        renderComponent(config.routes.login);
        const form = screen.getByTestId('auth-form');
        const submitButton = within(form).getByTestId('auth-submit-button');
        expect(submitButton).toHaveAttribute('type', 'submit');
    });

    // Test submit button
    it('submit button has a "Register" label when the register route is active', () => {
        renderComponent(config.routes.register);
        const submitButton = screen.getByTestId('auth-submit-button');
        expect(submitButton).toHaveTextContent(/register/i);
    });

    it('submit button has a "Login" label when the login route is active', () => {
        renderComponent(config.routes.login);
        const submitButton = screen.getByTestId('auth-submit-button');
        expect(submitButton).toHaveTextContent(/login/i);
    });

    // Test link
    // Login route
    it('contains a link with a "/register" href when on the "/login" route', () => {
        renderComponent(config.routes.login);
        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', '/register');
    });

    it ('navigates to the "/register" route when the register link is clicked', async () => {
        renderComponent(config.routes.login);
        const link = screen.getByRole('link');
        await userEvent.click(link);
        expect(screen.getByRole('heading')).toHaveTextContent(/register/i);
    });

    // Register route
    it('contains a link with a "/login" href when on the "/register" route', () => {
        renderComponent(config.routes.register);
        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', '/login');
    });

    it ('navigates to the "/login" route when the login link is clicked', async () => {
        renderComponent(config.routes.register);
        const link = screen.getByRole('link');
        await userEvent.click(link);
        expect(screen.getByRole('heading')).toHaveTextContent(/login/i);
    });
});




