import { type ChangeEvent, type FormEvent, useEffect,useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUserSelection } from 'store/selectors/user';

import Button from '../../UI/button/Button';
import Heading from '../../UI/heading/Heading';
import Input from '../../UI/input/Input';

import api from 'api';
import config from 'config';
import logging from 'services/logging';
import utils from 'utils';

import styling from './Authentication.module.scss';

import constants from './constants';

const Authentication = () => {
    // Store selectors
    const userSelectors = useUserSelection();

    
    // State
    const [state, setState] = useState({
        email: '',
        password: '',
        isLoading: false,
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

            setState((prevState) => ({ ...prevState, isLoading: true }));

            const submitFn = isLoginActive ? api.service.resources.authentication.login : api.service.resources.authentication.register;

            const response = await submitFn({
                email: state.email,
                password: state.password,
            });

            userSelectors.changeUser({ ...response.data });

        } catch (error) {
            logging.error(error as Error);
            
        } finally {
            setState((prevState) => ({ ...prevState, isLoading: false }));
        }
    };


   /**
    * Navigate to root when an "accessToken" is set and valid.
    */
   useEffect(() => {
        if (userSelectors.accessToken && utils.jwt.isValid(userSelectors.accessToken)) {
            navigate(config.routes.root);
        }
    }, [navigate, userSelectors.accessToken]);


    // Headings, labels and route
    const heading = isLoginActive ? constants.labels.heading.login : constants.labels.heading.register;
    const buttonLabel =  isLoginActive ? constants.labels.button.login : constants.labels.button.register;
    const authModeLinkLabel =  isLoginActive ? constants.labels.links.register : constants.labels.links.login;
    const route = isLoginActive ? config.routes.register : config.routes.login;


    return (
        <div className={styling.container}>
            <Heading level={2}>
                {heading}
            </Heading>

            <form className={styling.form} data-testid="auth-form" onSubmit={onSubmit}>
                <Input
                    label={constants.labels.input.email.label}
                    type="email"
                    name="email"
                    value={state.email}
                    placeholder={constants.labels.input.email.placeholder}
                    onChange={onInputChange}
                    testId='email-input'
                    required
                />

                <Input
                    label={constants.labels.input.password.label}
                    type="password"
                    name="password"
                    value={state.password}
                    placeholder={constants.labels.input.password.placeholder}
                    onChange={onInputChange}
                    testId='password-input'
                    required
                />

                <Button type="submit" isLoading={state.isLoading} testId='auth-submit-button'>
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