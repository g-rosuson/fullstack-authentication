import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserInterfaceSelection } from 'store/selectors/ui';
import { useUserSelection } from 'store/selectors/user';

import Avatar from 'components/UI/avatar/Avatar';
import Button from 'components/UI/button/Button';
import Dropdown from 'components/UI/dropdown/Dropdown';
import { SidebarOpen } from 'components/UI/icons/Icons';

import api from 'api';
import config from 'config';
import logging from 'services/logging';

import styling from './TopBar.module.scss';

const TopBar = () => {
    // Selectors
    const { isSidebarOpen, toggleSidebar } = useUserInterfaceSelection();
    const { email, clearUser } = useUserSelection();


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
     * Opens and closes the sidebar by toggling
     * the "isSidebarOpen" store property.
     */
    const onToggleSidebar = () => {
        toggleSidebar(!isSidebarOpen);
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
            clearUser();

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
            <Avatar email={email || ''} onClick={toggleMenu}/>
        </div>
    );


    return (
        <header className={styling.header}>
            <div>
                <Button
                    icon={<SidebarOpen thick/>}
                    ariaLabel='Open sidebar'
                    hidden={isSidebarOpen}
                    onClick={onToggleSidebar}
                    inline
                />
            </div>

            <Dropdown
                open={isMenuOpen}
                close={toggleMenu}
                actions={userMenuActions}
                controller={menuController}
                position={{ right: '0' }}
            />
        </header>
    );
};

export default TopBar;