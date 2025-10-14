import { CronJobType } from '../types';

/**
 * Calculates the next run date for a cron job based on its type and start date.
 * @param type - The type of cron job (daily, weekly, monthly, yearly)
 * @param startDate - The start date of the cron job
 * @returns The next run date
 */
const getNextRunDate = (type: CronJobType, startDate: Date) => {
    const dayInMs = 24 * 60 * 60 * 1000;
    const weekInMs = 7 * dayInMs;
    const monthInMs = 30 * dayInMs;
    const yearInMs = 365 * dayInMs;
    const startDateInMs = new Date(startDate).getTime();

    // Default to daily
    let nextRun = new Date(startDateInMs + dayInMs);

    if (type === 'weekly') {
        nextRun = new Date(startDateInMs + weekInMs);
    } else if (type === 'monthly') {
        nextRun = new Date(startDateInMs + monthInMs);
    } else if (type === 'yearly') {
        nextRun = new Date(startDateInMs + yearInMs);
    }

    return nextRun;
};

const utils = {
    getNextRunDate,
};

export default utils;
