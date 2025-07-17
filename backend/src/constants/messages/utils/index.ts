import { Messages, PlaceholderKeys } from '../types';

/**
 * Interpolates placeholders in the message string with values from the placholders object.
 * Example: resolvePlaceholders('User {user} logged in at {time}', { user: 'Alice', time: '10:00' })
 * returns: 'User Alice logged in at 10:00'
 * Note: If a placeholder is missing, it is replaced with [MISSING: key].
 */
const resolvePlaceholders = (message: Messages, placeholders: Partial<Record<PlaceholderKeys, string | number>>) => {
    return message.replace(/\{(\w+)\}/g, (_match, rawKey) => {
        const key = rawKey as PlaceholderKeys;

        if (key in placeholders && placeholders[key] !== undefined) {
            return String(placeholders[key]);
        }

        return `[MISSING: ${key}]`;
    });
};

export { resolvePlaceholders };
