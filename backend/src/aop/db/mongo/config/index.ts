/**
 * MongoDB configuration object containing database connection details and collection settings.
 * This configuration drives the database initialization, indexing, and repository setup.
 */
const config = {
    db: {
        name: process.env.MONGO_DB_NAME!,
        uri: process.env.MONGO_URI!,
        collection: {
            users: {
                name: process.env.MONGO_USER_COLLECTION_NAME!,
                // Field to create index on (e.g., 'email')
                targetField: 'email',
                // Index sort order: 1 for ascending, -1 for descending
                targetValue: 1,
                // Whether the index should enforce uniqueness
                unique: true,
                // Whether to create an index for this collection at startup
                index: true,
            },
            cronJobs: {
                name: process.env.MONGO_CRON_JOBS_COLLECTION_NAME!,
                // Field to create index on (e.g., 'name')
                targetField: 'name',
                // Index sort order: 1 for ascending, -1 for descending
                targetValue: 1,
                // Whether the index should enforce uniqueness
                unique: true,
                // Whether to create an index for this collection at startup
                index: true,
            },
        },
    },
};

export default config;
