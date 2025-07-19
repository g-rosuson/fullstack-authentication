import config from './config';
import setup from './setup';

import client from './client';
import service from './service';

const dbSetup = setup(config);
const dbClient = client(config, dbSetup);

const disconnect = dbClient.disconnect;
const connect = dbClient.connect;
const database = dbClient.database;

export { database, disconnect, connect, service };
