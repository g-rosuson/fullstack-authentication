const config = {
    db: {
        name: process.env.MONGO_DB_NAME!,
        uri: process.env.MONGO_URI!,
        collection: {
            users: {
                name: process.env.MONGO_USER_COLLECTION_NAME!,
                targetField: 'email',
                targetValue: 1,
                unique: true,
            },
        },
    },
};

export default config;
