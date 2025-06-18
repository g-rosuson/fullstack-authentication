import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserInterfaceSelection } from 'store/selectors/ui';
import { useUserSelection } from 'store/selectors/user';
import { Theme } from 'types/theme';

import Avatar from 'components/UI/avatar/Avatar';
import Button from 'components/UI/button/Button';
import Dropdown from 'components/UI/dropdown/Dropdown';
import { Logout, Moon, SidebarOpen, Sun } from 'components/UI/icons/Icons';

import api from 'api';
import config from 'config';
import logging from 'services/logging';
import storage from 'services/storage';
import utils from 'utils';

import styling from './TopBar.module.scss';

const TopBar = () => {
    // Selectors
    const { isSidebarOpen, theme, toggleSidebar, changeTheme } = useUserInterfaceSelection();
    const { email, clearUser } = useUserSelection();


    // State
    const [isMenuOpen, setIsMenuOpen] = useState(false);


    // Hooks
    const navigate = useNavigate();


    /**
     * Toggles the "isMenu" boolean state property.
     */
    const onToggleDropdownMenu = () => {
        setIsMenuOpen(prevState => !prevState);
    };


    /**
     * Changes the theme and hides flash of unstyles content.
     */
    const onThemeChange = async () => {
        const root = document.documentElement;

        // Turn of the lights to hide flash of unstyled content 
        root.style.filter = 'brightness(0)';

        // Add a delay to wait for the filter being applied
        await utils.time.sleep(450);

        // Toogle theme
        const newTheme = theme === 'dark' ? 'light' : 'dark';

        // Update store
        changeTheme(newTheme);

        // Persist theme in local storage
        storage.setTheme(newTheme);

        // Add a delay to hide flash of unstyled content
        await utils.time.sleep(150);

        // Set data-theme attribute value as the theme, to render corresponding CSS color palette
        root.setAttribute('data-theme', newTheme);

        // Remove filter
        root.style.filter = '';
    };


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
            icon: <Logout thick/>,
            action: onLogout
        }
    ];


    // Determine menu controller
    const menuController = (
        <div className={styling.avatar}>
            <Avatar email={email || ''} onClick={onToggleDropdownMenu}/>
        </div>
    );


    // Determine active theme
    const isDarkModeActive = theme === 'dark';


    // Determine theme icon
    const ThemeIcon = isDarkModeActive ? Sun : Moon;


    // Determine theme button aria-label
    const nextThemeForAriaLabel: Theme = isDarkModeActive ? 'light' : 'dark';
    const themeButtonAriaLabel = `Change theme to ${nextThemeForAriaLabel} mode`;


    return (
        <header className={styling.header}>
            <div>
                <Button
                    icon={<SidebarOpen thick/>}
                    ariaLabel='Open sidebar'
                    testId='open-sidebar-btn'
                    hidden={isSidebarOpen}
                    onClick={toggleSidebar}
                    inline
                />
            </div>

            <div className={styling.wrapper}>
                <Button
                    icon={<ThemeIcon thick/>}
                    ariaLabel={themeButtonAriaLabel}
                    testId='toggle-theme-btn'
                    onClick={utils.time.throttle(onThemeChange, 1000)} 
                />

                <Dropdown
                    open={isMenuOpen}
                    close={onToggleDropdownMenu}
                    actions={userMenuActions}
                    controller={menuController}
                    position={{ right: '0' }}
                />
            </div>
        </header>
    );
};

export default TopBar;