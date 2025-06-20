import { connect, disconnect, getDatabase } from './client';
import service from './service';

const db = {
    service,
    getDatabase,
    disconnect,
    connect,
};

export default db;
