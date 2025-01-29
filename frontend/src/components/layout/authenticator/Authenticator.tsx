import { useCallback, useEffect, useRef, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import Spinner from '../../UI/spinner/Spinner';
import TopBar from '../topBar/TopBar';

import api from 'api';
import config from 'config';
import { actions, useStore } from 'store';
import utils from 'utils';

const Authenticator = () => {
    // Store
    const store = useStore();


    // State
    const [isLoading, setIsLoading] = useState(true);


    // Refs
    const hasMounted = useRef(false)


    // Hooks
    const navigate = useNavigate();


    /**
     * - Validates the "accessToken" in the global state.
     * - Renews the "accessToken" when invalid or missing and re-routes
     *   the user to the login page when the renewal is rejected.
     */
    const authenticate = useCallback(async () => {
        try {
            const isJwtValid = !!store.user.accessToken && utils.jwt.isValid(store.user.accessToken);

            if (!isJwtValid) {
                // Note: "refreshAccessToken" will throw an Error if unsuccessful
                const response = await api.service.resources.authentication.refreshAccessToken();

                const payload = {
                    payload: {
                        accessToken: response.accessToken,
                        email: response.email,
                        id: response.id
                    },
                    type: actions.user.change_user
                }

                store.dispatch(payload);
            }

            hasMounted.current = true;
            setIsLoading(false);

        } catch (error) {
            console.error(error);
            navigate(config.routes.login);
        }
    },[navigate, store]);


    /**
     * Invokes "authenticate" on-mount or navigates to
     * the login page when the user logged out.
     */
    useEffect(() => {
        // Determine if the user logged out
        const hasLoggedOut = hasMounted.current && !store.user.accessToken;

        if (hasLoggedOut) {
            navigate(config.routes.login);

        } else {
            authenticate();
        }
    }, [authenticate, navigate, store.user.accessToken]);


    // Determine authenticated component
    const authenticatedComponent = (
        <>
            <TopBar/>
            <Outlet/>
        </>
    );


    return isLoading ? <Spinner /> : authenticatedComponent;
};

export default Authenticator;