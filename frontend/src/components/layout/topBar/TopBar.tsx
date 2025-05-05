import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Avatar from '../../UI/avatar/Avatar';
import Dropdown from '../../UI/dropdown/Dropdown';

import api from 'api';
import config from 'config';
import logging from 'services/logging';
import { useStore } from 'store';

import styling from './TopBar.module.scss';

const TopBar = () => {
    // Store
    const store = useStore();


    // State
    const [isMenuOpen, setIsMenuOpen] = useState(false);


    // Hooks
    const navigate = useNavigate();


    /**
     * Toggles the "isMenu" boolean state property.
     */
    const toggleMenu = () => {
        setIsMenuOpen(prevState => !prevState);
    }


    /**
     * - Calls the logout endpoint which clears the httpOnly browser cookie.
     * - And when successful, resets the "user" store object and navigates
     *   the user to the"login" page.
     */
    const onLogout = async () => {
        try {
            // Log user out
            await api.service.resources.authentication.logout();

            // Reset the user store object
            store.user.clearUser();

            navigate(config.routes.login);

        } catch (error) {
            logging.error(error as Error);
        }
    };


    // Determine user menu actions
    const userMenuActions = [
        {
            label: 'Logout',
            action: onLogout
        }
    ];


    // Determine menu controller
    const menuController = (
        <div className={styling.avatar}>
            <Avatar email={store.user.email || ''} onClick={toggleMenu}/>
        </div>
    );


    return (
        <header className={styling.header}>
            <nav>
                <ul className={styling.links}>
                    <li>
                        <Link to={config.routes.root}>Home</Link>
                    </li>
                </ul>
            </nav>

            <Dropdown
                open={isMenuOpen}
                close={toggleMenu}
                actions={userMenuActions}
                controller={menuController}
            />
        </header>
    );
};

export default TopBar;