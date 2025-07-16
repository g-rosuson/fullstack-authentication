/**
 * Interpolates placeholders in the message string with values from the context object.
 * If a placeholder is missing, it is replaced with [MISSING: key].
 * Example: getMessageWithCtx('User {user} logged in at {time}', { user: 'Alice', time: '10:00' })
 * returns: 'User Alice logged in at 10:00'
 */
const getMessageWithCtx = (message: string, ctx: Record<string, string | number>): string => {
    return message.replace(/\{(\w+)\}/g, (_match, key) => {
        if (Object.prototype.hasOwnProperty.call(ctx, key)) {
            return String(ctx[key]);
        }
        return `[MISSING: ${key}]`;
    });
};

export { getMessageWithCtx };
