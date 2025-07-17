import { Messages } from '../types';

import { resolvePlaceholders } from '.';

describe('resolvePlaceholders utility: ', () => {
    it('replaces a single placeholder with the correct value', () => {
        const msg = 'Fetched collection: {collectionName}';
        expect(resolvePlaceholders(msg as Messages, { collectionName: 'users' })).toBe('Fetched collection: users');
    });

    it('replaces multiple placeholders with correct values', () => {
        const msg = '{collectionName} collection fetched on port {port}';
        expect(resolvePlaceholders(msg as Messages, { collectionName: 'users', port: '8800' })).toBe(
            'users collection fetched on port 8800'
        );
    });

    it('inserts [MISSING: key] if the value is missing', () => {
        const msg = '{collectionName} collection fetched on port {port}';
        expect(resolvePlaceholders(msg as Messages, {})).toBe(
            '[MISSING: collectionName] collection fetched on port [MISSING: port]'
        );
    });

    it('inserts number as string', () => {
        const msg = 'Port: {port}';
        expect(resolvePlaceholders(msg as Messages, { port: 8080 })).toBe('Port: 8080');
    });

    it('does not replace if there are no placeholders', () => {
        const msg = 'No placeholders here.';
        expect(resolvePlaceholders(msg as Messages, { collectionName: 'value' })).toBe('No placeholders here.');
    });

    it('handles multiple missing placeholders', () => {
        const msg = 'User {user} at {time}';
        expect(resolvePlaceholders(msg as Messages, {})).toBe('User [MISSING: user] at [MISSING: time]');
    });
});
