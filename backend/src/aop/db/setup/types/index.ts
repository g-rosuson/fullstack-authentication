import type { Db } from 'mongodb';

interface Setup {
    // eslint-disable-next-line no-unused-vars
    pingDatabase: (db: Db) => Promise<void>;
    // eslint-disable-next-line no-unused-vars
    indexCollections: (db: Db) => Promise<void>;
}

export type { Setup };
