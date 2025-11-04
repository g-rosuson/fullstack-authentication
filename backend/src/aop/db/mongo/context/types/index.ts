import type { ClientSession } from 'mongodb';

export interface Transaction {
    startSession: () => ClientSession;
}
