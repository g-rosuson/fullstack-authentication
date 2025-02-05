import { type ChangeEvent, type FormEvent, useEffect,useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import Button from '../../UI/button/Button';
import Input from '../../UI/input/Input';

import api from 'api';
import config from 'config';
import logging from 'services/logging';
import { actions, useStore } from 'store';
import utils from 'utils';

import styling from './Authentication.module.scss';

import constants from './constants';

const Authentication = () => {
    // Store
    const store = useStore();


    // State
    const [state, setState] = useState({
        email: '',
        password: '',
    });


    // Hooks
    const location = useLocation();
    const navigate = useNavigate();


    // Flags
    const isLoginActive = location.pathname === config.routes.login;



    /**
     * Sets the input field changes in the state.
     */
    const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };


    /**
     * Sets the "accessToken" in the global state on login and register.
     */
    const onSubmit = async (event: FormEvent) => {
        try {
            event.preventDefault();

            const submitFn = isLoginActive ? api.service.resources.authentication.login : api.service.resources.authentication.register;

            const response = await submitFn(state);

            const dispatchPayload = {
                payload: {
                    accessToken: response.accessToken,
                    email: response.email,
                    id: response.id
                },
                type: actions.user.change_user
            }

            store.dispatch(dispatchPayload);

        } catch (error) {
            logging.error(error as Error);
        }
    };


   /**
    * Navigate to root when an "accessToken" is set and valid.
    */
   useEffect(() => {
        if (store.user.accessToken && utils.jwt.isValid(store.user.accessToken)) {
            navigate(config.routes.root);
        }
    }, [navigate, store.user.accessToken]);


    // Headings, labels and route
    const heading = isLoginActive ? constants.labels.heading.login : constants.labels.heading.register;
    const buttonLabel =  isLoginActive ? constants.labels.button.login : constants.labels.button.register;
    const authModeLinkLabel =  isLoginActive ? constants.labels.links.register : constants.labels.links.login;
    const route = isLoginActive ? config.routes.register : config.routes.login;


    return (
        <div className={styling.container}>
            <h2>{heading}</h2>

            <form className={styling.form} onSubmit={onSubmit}>
                <Input
                    label={constants.labels.input.email.label}
                    type="email"
                    name="email"
                    value={state.email}
                    placeholder={constants.labels.input.email.placeholder}
                    onChange={onInputChange}
                />

                <Input
                    label={constants.labels.input.password.label}
                    type="password"
                    name="password"
                    value={state.password}
                    placeholder={constants.labels.input.password.placeholder}
                    onChange={onInputChange}
                />

                <Button type="submit">
                    {buttonLabel}
                </Button>
            </form>

            <div className={styling.link}>
                <Link to={route}>
                    {authModeLinkLabel}
                </Link>
            </div>
        </div>
    );
};

export default Authentication;