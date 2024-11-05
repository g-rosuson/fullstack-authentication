import { getDatabase, connect, disconnect } from './client';
import service from './service';

const db = {
    service,
    getDatabase,
    disconnect,
    connect
}

export default db;