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
    const countdownTimeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);


    // Router
    const navigate = useNavigate();



    /**
     * Resets "countdown" with a delay to prevent content flash.
     */
    const onClose = () => {
        setTimeout(() => {
            countdownTimeoutId.current = null;
            hasRefreshedSession.current = false;
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
                    accessToken: response.accessToken,
                    email: response.email,
                    id: response.id
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
     * Note: Returns early when this function is invoked the second time after
     * logging out and setting the state.
     * - Logs the user out and resets the user object in the store.
     * - And navigates to the login page when successful.
     */
    const logout = useCallback(async () => {
        try {
            if (!store.user.accessToken) {
                return;
            }

            setIsSubmitting(true);

            await api.service.resources.authentication.logout();

            store.dispatch({ type: actions.user.clear_user });

            navigate(config.routes.login);

        } catch (error) {
            logging.error(error as Error);

            setIsSubmitting(false);
        }
    }, [navigate, store])


    /**
     * - Logs the user out when the "countdown" reaches zero.
     * - Starts a one-second interval when the "countdown" is greater than zero,
     *   decrementing the "countdown" every second.
     * - Clears the interval when the component unmounts or when the countdown stops.
     */
    useEffect(() => {
        if (open && countdown === 0) {
            logout();
            return;
        }

        if (open && !hasRefreshedSession.current) {
            countdownTimeoutId.current = setTimeout(() => {
                setCountdown(prevState => prevState - 1);
            }, constants.time.timeoutDuration);
        }

        return () => {
            if (typeof countdownTimeoutId.current === 'number') {
                clearTimeout(countdownTimeoutId.current);
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
        >
            <Heading level={2} size="l">
                {constants.labels.refreshSessionModal.title}
            </Heading>

            <span className={styling.caption}>
                Your session has expired, please refresh it within <b>{constants.time.logoutTimeout}</b> seconds to avoid being logged out.
            </span>

            <span className={styling.countdown}>You will be automatically logged out in: <b>{countdown}</b> seconds</span>
        </Modal>
    );
};

export default RefreshSession;