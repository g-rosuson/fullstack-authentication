import { getMessageWithCtx } from '.';

describe('getMessageWithCtx: ', () => {
    it('replaces a single placeholder with the correct value', () => {
        const msg = 'Hello, {name}!';
        expect(getMessageWithCtx(msg, { name: 'Alice' })).toBe('Hello, Alice!');
    });

    it('replaces multiple placeholders with correct values', () => {
        const msg = 'User {user} logged in at {time}';
        expect(getMessageWithCtx(msg, { user: 'Bob', time: '10:00' })).toBe('User Bob logged in at 10:00');
    });

    it('inserts [MISSING: key] if the value is missing', () => {
        const msg = 'Hello, {name}!';
        expect(getMessageWithCtx(msg, {})).toBe('Hello, [MISSING: name]!');
    });

    it('inserts number as string', () => {
        const msg = 'Port: {port}';
        expect(getMessageWithCtx(msg, { port: 8080 })).toBe('Port: 8080');
    });

    it('does not replace if there are no placeholders', () => {
        const msg = 'No placeholders here.';
        expect(getMessageWithCtx(msg, { any: 'value' })).toBe('No placeholders here.');
    });

    it('handles multiple missing placeholders', () => {
        const msg = 'User {user} at {time}';
        expect(getMessageWithCtx(msg, {})).toBe('User [MISSING: user] at [MISSING: time]');
    });
});
