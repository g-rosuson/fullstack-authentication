import { Db } from 'mongodb';

import { CronJobRepository } from '../repository/cron-job';
import { UserRepository } from '../repository/user';

/**
 * DbContext serves as the main database abstraction layer for the application.
 * It encapsulates the MongoDB database instance and exposes domain-specific repositories
 * instead of raw collections, promoting clean architecture and separation of concerns.
 *
 * Key responsibilities:
 * - Wraps the MongoDB Db instance
 * - Provides access to domain repositories (e.g., user, orders, etc.)
 * - Maintains consistent database access patterns across the application
 * - Enables easy testing through dependency injection
 *
 * Usage: Access via req.context.db in Express middleware/routes
 * Example: req.context.db.user.getByEmail('user@example.com')
 */
export class DbContext {
    /** The underlying MongoDB database instance */
    private readonly db: Db;
    /** Repository for user-related database operations */
    public readonly user: UserRepository;
    /** Repository for cron job-related database operations */
    public readonly cronJob: CronJobRepository;

    /**
     * Constructs a new DbContext instance.
     * Initializes all domain repositories with the provided database instance.
     * @param db The MongoDB Db instance to wrap and provide to repositories
     */
    constructor(db: Db) {
        this.db = db;
        this.user = new UserRepository(db);
        this.cronJob = new CronJobRepository(db);
    }

    /**
     * Provides direct access to the underlying MongoDB database instance.
     * Use sparingly - prefer using domain repositories when possible.
     * Useful for advanced operations not covered by repositories.
     *
     * @returns The MongoDB Db instance
     */
    get dbInstance() {
        return this.db;
    }
}
