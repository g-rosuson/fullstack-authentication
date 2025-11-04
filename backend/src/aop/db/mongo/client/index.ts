import { Db, MongoClient } from 'mongodb';

import { InternalException } from 'aop/exceptions/errors/system';
import { logger } from 'aop/logging';

import config from '../config';

import { ErrorMessage } from 'shared/enums/error-messages';

import type { MongoClientOptions } from './types';

/**
 * MongoClientManager is a singleton class responsible for managing the MongoDB client connection.
 * It provides a scalable and testable way to share a MongoDB client across your application,
 * while also allowing injection of a custom client for testing.
 *
 * Features:
 * - Singleton pattern ensures one connection per application
 * - Automatic database ping for health verification
 * - Config-driven index creation at startup
 * - Support for custom client injection (useful for testing)
 */
export class MongoClientManager {
    private static instance: MongoClientManager;
    private client: MongoClient | null = null;
    private db: Db | null = null;
    private uri: string;
    private dbName: string;

    /**
     * Private constructor to enforce singleton pattern.
     * Only accessible through getInstance() method.
     * @param options MongoClientOptions containing URI and database name
     */
    private constructor(options: MongoClientOptions) {
        this.uri = options.uri;
        this.dbName = options.dbName;
    }

    /**
     * Returns the singleton instance of MongoClientManager.
     * Creates a new instance if one doesn't exist, otherwise returns the existing instance.
     * This ensures only one MongoDB connection manager exists per application.
     * @param options MongoClientOptions containing URI and database name
     * @returns The singleton MongoClientManager instance
     */
    static getInstance(options?: MongoClientOptions): MongoClientManager {
        if (!this.instance && !options) {
            throw new InternalException(ErrorMessage.MONGO_CLIENT_MANAGER_INSTANCE_NOT_FOUND);
        }

        if (!this.instance && options) {
            this.instance = new MongoClientManager(options);
        }

        return this.instance;
    }

    /**
     * Connects to MongoDB and sets up the client and database instance.
     * This method is idempotent - if already connected, returns the existing database instance.
     * Performs the following operations:
     * 1. Establishes MongoDB client connection (or uses provided custom client)
     * 2. Selects the target database
     * 3. Pings the database to verify connectivity
     * 4. Creates indexes as specified in configuration
     *
     * @param customClient Optional custom MongoClient for testing purposes
     * @returns Promise resolving to the MongoDB Db instance
     * @throws Error if connection fails or database ping fails
     */
    async connect(customClient?: MongoClient) {
        // Return existing connection if already established
        if (this.db) {
            return this.db;
        }

        // Use custom client if provided (typically for testing)
        if (customClient) {
            this.client = customClient;
        }

        // Create new MongoDB client if none exists
        if (!this.client) {
            this.client = new MongoClient(this.uri);
            await this.client.connect();
        }

        // Select the target database
        this.db = this.client.db(this.dbName);

        // Initialize database (ping + create indexes)
        await this.initializeDb(this.db);

        return this.db;
    }

    /**
     * Disconnects and cleans up the MongoDB client connection.
     * Properly closes the client connection and resets internal state.
     * This method is safe to call multiple times - it will only disconnect if connected.
     *
     * @returns Promise that resolves when disconnection is complete
     */
    async disconnect() {
        if (this.client) {
            await this.client.close();

            this.client = null;
            this.db = null;
        }
    }

    /**
     * Starts a new MongoDB session if the client is connected.
     * @throws InternalException if the client is not connected
     * @returns The MongoDB session
     */
    public startSession() {
        if (!this.client) {
            throw new InternalException(ErrorMessage.MONGO_CLIENT_NOT_CONNECTED);
        }

        return this.client.startSession();
    }

    /**
     * Performs initial database setup operations after connection is established.
     * This method handles two critical initialization tasks:
     * 1. Database health verification via ping
     * 2. Index creation for collections marked for indexing in configuration
     *
     * The ping operation ensures the database is responsive before proceeding.
     * Index creation is driven by the configuration - only collections with `index: true`
     * will have their indexes created. This allows for flexible index management.
     *
     * @param db The MongoDB database instance to initialize
     * @throws Error if ping fails or index creation fails
     */
    private async initializeDb(db: Db) {
        // Ping database
        logger.info('Pinging database');

        await db.command({ ping: 1 });

        logger.info('Database pinged');

        // Index collections
        logger.info('Indexing collections');

        const collections = Object.values(config.db.collection).filter(item => item.index);

        for (const item of collections) {
            await db
                .collection(item.name)
                .createIndex({ [item.targetField]: item.targetValue }, { unique: item.unique });
        }

        logger.info('Collections indexed');
    }
}
