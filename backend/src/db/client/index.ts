import { MongoClient, ServerApiVersion } from 'mongodb';

import config from 'config';

const DB_NAME = config.mongoDBName;

const client = new MongoClient(config.mongoURL, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    maxPoolSize: 10
});

const connect = async () => {
    try {
        await client.connect();

        await client.db(DB_NAME).command({ ping: 1 });
        console.log('Pinged your deployment. You successfully connected to MongoDB!');

    } catch(err) {
        console.error(err);
    }
}

const disconnect = async () => {
    try {
        await client.close();
        console.log('Disconnected from MongoDB');

    } catch (err) {
        console.error('Error disconnecting from MongoDB:', err);
    }
};

const getDatabase = () => {
    if (client?.db()) {
        return client.db(DB_NAME);
    }

    throw Error('Could not access DB');
}

export { getDatabase, connect, disconnect }