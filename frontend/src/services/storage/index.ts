import { type Theme } from 'store/slices/ui/ui.types';

// Determine local storage theme key name
const THEME_KEY = 'theme';

/**
 * Sets the given theme in local storage.
 */
const setTheme = (theme: Theme) => {
    localStorage.setItem(THEME_KEY, theme);
};

/**
 * Gets the theme from local storage.
 */
const getTheme = () => {
    return localStorage.getItem(THEME_KEY);
};

export default {
    setTheme,
    getTheme
}

