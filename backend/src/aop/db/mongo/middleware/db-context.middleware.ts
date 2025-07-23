import { MongoClient } from 'mongodb';

import type { NextFunction, Request, Response } from 'express';

import { MongoClientManager } from '../client';
import { DbContext } from '../context';

/**
 * Database context middleware factory for Express applications.
 * This middleware ensures that every request has access to a properly initialized
 * database context through req.context.db, enabling clean separation of concerns
 * and consistent database access patterns throughout the application.
 *
 * Key features:
 * - Singleton connection management (one connection per application)
 * - Automatic database initialization (ping + indexes)
 * - Domain repository access via req.context.db.user, etc.
 * - Support for custom client injection (useful for testing)
 * - Proper error propagation to Express error handlers
 *
 * Usage:
 * Add middleware to server.ts
 * app.use(mongo.dbContextMiddleware);
 *
 * server.ts --> app.use(mongo.dbContextMiddleware);
 *
 * Then in controllers:
 * const user = await req.context.db.user.getByEmail(email);
 *
 * @param options Configuration object containing MongoDB connection details
 * @param options.uri MongoDB connection URI
 * @param options.dbName Target database name
 * @param customClient Optional custom MongoClient for testing purposes
 * @returns Express middleware function that injects DbContext into requests
 */
export function dbContextMiddleware(options: { uri: string; dbName: string }, customClient?: MongoClient) {
    return async function (req: Request, _res: Response, next: NextFunction) {
        try {
            // Get or create the singleton MongoDB client manager
            const manager = MongoClientManager.getInstance(options);

            // Connect to database (idempotent - returns existing connection if available)
            const db = await manager.connect(customClient);

            // Create and attach database context to request object
            req.context.db = new DbContext(db);

            // Continue to next middleware/route handler
            next();
        } catch (error) {
            // Forward any database connection errors to Express error handler
            next(error);
        }
    };
}
