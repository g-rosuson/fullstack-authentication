import { useCallback,useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import TopBar from '../topBar/TopBar';

import api from 'api';
import config from 'config';
import { actions,useStore } from 'store';
import utils from 'utils';

const Authenticator = () => {
    // State
    const [{ isLoading }, setState] = useState({
        isLoading: true
    });


    // Store
    const store = useStore();


    // Hooks
    const navigate = useNavigate();


    /**
     * - Validates the "accessToken" in the global state.
     * - Renews the "accessToken" when invalid or missing and re-routes
     *   the user to the login page when the renewal is rejected.
     */
    const authenticate = useCallback(async () => {
        try {
            const isJwtValid = !!store.authentication.accessToken && utils.jwt.isValid(store.authentication.accessToken);

            if (!isJwtValid) {
                // Note: "refreshAccessToken" will throw an Error if unsuccessful
                const response = await api.service.resources.authentication.refreshAccessToken();

                const payload = {
                    payload: response.accessToken,
                    type: actions.authentication.change_access_token
                }

                store.dispatch(payload)
            }
        } catch (error) {
            console.error(error);
            navigate(config.routes.login);

        } finally {
            setState(prevState => ({
                ...prevState,
                isLoading: false
            }));
        }
    },[]);


    /**
     * Invokes "authenticate" on-mount.
     */
    useEffect(() => {
        authenticate();
    }, [authenticate]);


    // Determine views
    const spinner = (
        <div>
            Loading...
        </div>
    )

    const component = (
        <>
            <TopBar/>
            <Outlet/>
        </>
    );


    return isLoading ? spinner : component;
};

export default Authenticator;