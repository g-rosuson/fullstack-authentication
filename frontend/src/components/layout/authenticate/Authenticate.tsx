import { useCallback, useEffect, useRef, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import Spinner from '../../UI/spinner/Spinner';
import TopBar from '../topBar/TopBar';
import RefreshSessionModal from 'components/layout/authenticate/refreshSession/RefreshSession';

import api from 'api';
import config from 'config';
import { actions, useStore } from 'store';
import utils from 'utils';


const Authenticate = () => {
    // Store
    const store = useStore();


    // State
    const [isRenewSessionModalOpen, setIsRefreshSessionModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    // Refs
    const hasMountedRef = useRef(false);


    // Hooks
    const navigate = useNavigate();


    /**
     * Toggles the "Refresh session" modal visibility.
     */
    const toggleRefreshSessionModal = useCallback(() => {
        setIsRefreshSessionModalOpen(prevState => !prevState);
    }, []);


    /**
     * - Renews the "accessToken" when its invalid or missing.
     * - Re-routes the user to the login page when the renewal is unsuccessful.
     */
    const renewAccessToken = useCallback(async () => {
        try {
            setIsLoading(true);

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

            hasMountedRef.current = true;

            setIsLoading(false);

        } catch (error) {
            console.error(error);

            // When the "refreshAccessToken" endpoint
            // throws an error, navigate to login page
            navigate(config.routes.login);
        }
    }, [store, navigate]);


    /**
     * - Creates a timeout which is triggered when the accessToken in the store expires.
     * - When the timeout is triggered, it opens a modal which allows the user to renew the
     *   accessToken/session. If no action is taken or the refreshToken cookie is invalid,
     *   the user is logged out.
     */
    useEffect(() => {
        if (!store.user.accessToken) {
            return;
        }

        setIsLoading(true);

        const decoded =  utils.jwt.decode(store.user.accessToken);

        // Current time in ms
        const currentTime = Date.now();

        // JWT expiry time in ms
        const jwtExpiry = (decoded.exp || 0) * 1000;

        // Deduct the expiry token date from the current time,
        // to create the setTimout duration
        const timeUntilRenewal = jwtExpiry - currentTime;

        // Create a timout that triggers a modal that prompts
        // the user to renew the accessToken when it expires
        const renewSessionTimeout = setTimeout(toggleRefreshSessionModal, timeUntilRenewal);

        hasMountedRef.current = true;

        setIsLoading(false);

        return () => {
            clearTimeout(renewSessionTimeout);
        };
    }, [isLoading, store.user.accessToken, toggleRefreshSessionModal]);


    /**
     * - Attempts to refresh the "accessToken" when it's not
     *   set and the component has not mounted.
     */
    useEffect(() => {
        if (!store.user.accessToken && !hasMountedRef.current) {
            renewAccessToken();
        }
    }, [renewAccessToken, store.user.accessToken]);


    // Determine authenticated component
    const authenticatedComponent = (
        <>
            <TopBar/>
            <Outlet/>
            <RefreshSessionModal
                open={isRenewSessionModalOpen}
                close={toggleRefreshSessionModal}
            />
        </>
    );


    return isLoading ? <Spinner /> : authenticatedComponent;
};

export default Authenticate;