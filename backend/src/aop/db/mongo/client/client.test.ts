import { MongoClient } from 'mongodb';

import type { MongoClientOptions } from './types';

import { MongoClientManager } from './';

/**
 * Testing Strategy for MongoClientManager
 *
 * This test suite tests a singleton class that manages MongoDB connections.
 * Key testing considerations:
 *
 * 1. SINGLETON PATTERN: The class maintains one instance across the application.
 *    - Tests must reset the singleton state when testing different scenarios
 *    - Use (MongoClientManager as unknown as { instance: MongoClientManager | null }).instance = null
 *
 * 2. CONNECTION STATE: The class maintains internal connection state (client, db).
 *    - Once connected, subsequent connect() calls return existing connection
 *    - disconnect() resets internal state, allowing fresh connections
 *
 * 3. CUSTOM CLIENT INJECTION: Designed for testing isolation.
 *    - Allows injecting mock clients instead of real MongoDB connections
 *    - Tests both paths: with and without custom client
 *
 * 4. MOCK STRATEGY: Global mocks for MongoDB dependencies.
 *    - Mock MongoClient constructor to avoid real database connections
 *    - Mock Db methods (command, collection) to test initialization behavior
 *    - Use mockRejectedValueOnce() for error scenario testing
 */

// Mock mongodb
const mockCreateIndex = vi.fn().mockResolvedValue('ok');
const mockCollection = vi.fn(() => ({ createIndex: mockCreateIndex }));
const mockCommand = vi.fn().mockResolvedValue({});
const mockDb = { command: mockCommand, collection: mockCollection };

const mockConnect = vi.fn().mockResolvedValue(undefined);
const mockDbFn = vi.fn(() => mockDb);
const mockClose = vi.fn().mockResolvedValue(undefined);

const mockClient = { connect: mockConnect, db: mockDbFn, close: mockClose };

vi.mock('mongodb', async importOriginal => {
    const actual = await importOriginal();
    return {
        ...(actual || {}),
        MongoClient: vi.fn(() => mockClient),
    };
});

describe('MongoClientManager', () => {
    const testOptions: MongoClientOptions = {
        uri: 'mongodb://localhost:27017/test',
        dbName: 'test-database',
    };

    describe('getInstance()', () => {
        // Get singleton instance - this will be the same unless explicitly reset
        const dbInstance = MongoClientManager.getInstance(testOptions);

        it('should create a new mongo client instance on first call', () => {
            expect(dbInstance).toBeInstanceOf(MongoClientManager);
        });

        it('should return the same instance on subsequent calls', () => {
            const secondInstance = MongoClientManager.getInstance(testOptions);
            expect(dbInstance).toBe(secondInstance);
        });
    });

    describe('connect()', () => {
        // Get singleton instance for connect tests
        // Note: This instance may already have a connection from previous tests
        const dbInstance = MongoClientManager.getInstance(testOptions);

        it('should call connect and make a new db connection', async () => {
            const db = await dbInstance.connect();
            expect(mockConnect).toHaveBeenCalled();
            expect(db).toBe(mockDb);
        });

        it('should call connect() and return the same db connection on subsequent calls', async () => {
            // Test idempotent behavior: subsequent calls return existing connection
            const secondDb = await dbInstance.connect();
            expect(mockConnect).toHaveBeenCalled();
            expect(secondDb).toBe(mockDb);
        });

        it('should use the provided custom client and create a new db connection', async () => {
            // CRITICAL: Reset singleton to test custom client injection
            // Without reset, the existing client is used
            (MongoClientManager as unknown as { instance: MongoClientManager | null }).instance = null;

            const newDbInstance = MongoClientManager.getInstance(testOptions);
            const customClient = { db: vi.fn().mockReturnValue(mockDb) } as unknown as MongoClient;
            const db = await newDbInstance.connect(customClient);

            expect(db).toBe(mockDb);
        });

        it('should call initializeDb() and create indexes for the collections', async () => {
            // Test contract: connect() should create necessary indexes
            // This verifies the public API behavior, not implementation details
            expect(mockCreateIndex).toHaveBeenCalled();
        });

        it('should call initializeDb() and ping the database', async () => {
            // Test contract: connect() should ping database for health check
            // This verifies the public API behavior, not implementation details
            expect(mockCommand).toHaveBeenCalled();
        });
    });

    describe('connect(): error handling', () => {
        let dbInstance: MongoClientManager;

        beforeEach(() => {
            // CRITICAL: Reset singleton before each error test
            // This ensures each test goes through the full connection process
            // where errors can occur, rather than reusing existing connections
            (MongoClientManager as unknown as { instance: MongoClientManager | null }).instance = null;

            dbInstance = MongoClientManager.getInstance(testOptions);
        });

        it('should throw error when client connection fails', async () => {
            const errorMessage = 'Connection failed';

            // Override mock for this test only - mockRejectedValueOnce() reverts after use
            mockConnect.mockRejectedValueOnce(new Error(errorMessage));

            await expect(dbInstance.connect()).rejects.toThrow(errorMessage);
        });

        it('should throw error when database ping fails', async () => {
            const errorMessage = 'Ping failed';

            // Override mock for this test only - mockRejectedValueOnce() reverts after use
            mockCommand.mockRejectedValueOnce(new Error(errorMessage));

            await expect(dbInstance.connect()).rejects.toThrow(errorMessage);
        });

        it('should throw error when index creation fails', async () => {
            const errorMessage = 'Index creation failed';

            // Override mock for this test only - mockRejectedValueOnce() reverts after use
            mockCreateIndex.mockRejectedValueOnce(new Error(errorMessage));

            await expect(dbInstance.connect()).rejects.toThrow(errorMessage);
        });
    });

    describe('disconnect()', () => {
        let dbInstance: MongoClientManager;

        beforeEach(() => {
            // Reset singleton to ensure clean state for disconnect tests
            // This allows testing both connected and disconnected scenarios
            (MongoClientManager as unknown as { instance: MongoClientManager | null }).instance = null;

            dbInstance = MongoClientManager.getInstance(testOptions);
        });

        afterEach(() => {
            // Clear mock call history between tests to prevent interference
            vi.clearAllMocks();
        });

        it('should call disconnect() and close the client', async () => {
            // Test disconnect when connected: should call close() and reset internal state
            await dbInstance.connect();
            await dbInstance.disconnect();
            expect(mockClose).toHaveBeenCalled();
        });

        it('should not call disconnect() when client is not connected', async () => {
            // Test disconnect when not connected: should be safe to call multiple times
            await dbInstance.disconnect();
            expect(mockClose).not.toHaveBeenCalled();
        });
    });

    describe('disconnect(): error handling', () => {
        it('should throw error when close() fails', async () => {
            const dbInstance = MongoClientManager.getInstance(testOptions);

            // Re-connect to client
            await dbInstance.connect();

            const errorMessage = 'Failed to disconnect';

            // Override mock for this test only - mockRejectedValueOnce() reverts after use
            mockClose.mockRejectedValueOnce(new Error(errorMessage));

            await expect(dbInstance.disconnect()).rejects.toThrow(errorMessage);
        });
    });
});
