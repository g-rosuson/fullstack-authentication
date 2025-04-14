import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Heading from 'components/UI/heading/Heading';
import Modal from 'components/UI/modal/Modal';

import api from 'api';
import config from 'config';
import logging from 'services/logging';
import { actions, useStore } from 'store';

import styling from './RefreshSession.module.scss';

import constants from './constants';
import { Props } from './RefreshSession.types';

const RefreshSession = ({ open, close }: Props) => {
    // Store
    const store = useStore();


    // State
    const [countdown, setCountdown] = useState(constants.time.logoutTimeout);
    const [isSubmitting, setIsSubmitting] = useState(false);


    // Refs
    const hasRefreshedSession = useRef(false);
    const isLoggingOut = useRef(false);
    const countdownTimeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);
    const resetCountdownTimeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);


    // Router
    const navigate = useNavigate();


    /**
     * Resets "countdown" with a delay to prevent content flash.
     */
    const onClose = () => {
        resetCountdownTimeoutId.current = setTimeout(() => {
            countdownTimeoutId.current = null;
            hasRefreshedSession.current = false;
            isLoggingOut.current = false;
            setCountdown(constants.time.logoutTimeout);
        }, constants.time.resetStateTimeout);

        close?.();
    };


    /**
     * - Gets a new "accessToken" from the "refreshAccessToken" endpoint and
     *   sets it in the store when the httpOnly "refreshToken" cookie is valid.
     * - Reset the "accessToken" in the store and navigates the user to the
     *   login page when the httpOnly "refreshToken" cookie is not valid.
     */
    const renewSession = async () => {
        try {
            setIsSubmitting(true);

            const response = await api.service.resources.authentication.refreshAccessToken();

            const payload = {
                payload: {
                    accessToken: response.data.accessToken,
                    email: response.data.email,
                    id: response.data.id
                },
                type: actions.user.change_user
            }

            store.dispatch(payload);

            hasRefreshedSession.current = true;

            setIsSubmitting(false);

            onClose();

        } catch (error) {
            logging.error(error as Error);

            // When the "refreshAccessToken" endpoint throws an error,
            // reset the "accessToken" in the store and navigate to
            // login page
            store.dispatch({ type: actions.user.clear_user });
            navigate(config.routes.login);
        }
    }


    /**
     * Calls the "logout" endpoint when an "accessToken" is set in the store,
     * and clears the user object in the store and navigates to the login route
     */
    const logout = useCallback(async () => {
        try {
            setIsSubmitting(true);

            if (store.user.accessToken) {
                await api.service.resources.authentication.logout();
            }

        } catch (error) {
            logging.error(error as Error);

        } finally {
            store.dispatch({ type: actions.user.clear_user });
            navigate(config.routes.login);
        }
    }, [navigate, store]);


    /**
     * - Logs the user out when the "countdown" reaches zero.
     * - Starts a one-second interval when the "countdown" is greater than zero,
     *   decrementing the "countdown" every second.
     * - Clears the interval when the component unmounts or when the countdown stops.
     */
    useEffect(() => {
        // Log the user out when:
        // - The modal is open
        // - The countdown reaches zero
        // - The user is not already being logged out
        if (open && countdown === 0 && !isLoggingOut.current) {
            isLoggingOut.current = true;
            logout();
            return;
        }

        // Decrement the countdown when:
        // - The modal is open
        // - The countdown is greater than zero
        // - The session is not being refreshed
        if (open && countdown > 0 && !hasRefreshedSession.current) {
            countdownTimeoutId.current = setTimeout(() => {
                setCountdown(prevState => prevState - 1);
            }, constants.time.timeoutDuration);
        }

        return () => {
            if (typeof countdownTimeoutId.current === 'number') {
                clearTimeout(countdownTimeoutId.current);
            }

            if (typeof resetCountdownTimeoutId.current === 'number') {
                clearTimeout(resetCountdownTimeoutId.current);
            }
        };
    }, [countdown, logout, open]);


    return (
        <Modal
            open={open}
            close={close}
            size="s"
            primaryLabel={constants.labels.refreshSessionModal.confirmBtn}
            primaryAction={renewSession}
            isLoading={isSubmitting}
            disableClose
        >
            <Heading level={2} size="l">
                {constants.labels.refreshSessionModal.title}
            </Heading>

            <span className={styling.caption}>
                Your session has expired, please refresh it within <b>{constants.time.logoutTimeout}</b> seconds to avoid being logged out.
            </span>

            <span className={styling.countdown}>You will be automatically logged out in: <b data-testid="countdown">{countdown}</b> seconds</span>
        </Modal>
    );
};

export default RefreshSession;