import config from 'aop/config';

class Logger {
    private log(level: 'debug' | 'info' | 'warn' | 'error', message: string, meta?: object) {
        const timestamp = new Date().toISOString();

        const logData = {
            timestamp,
            level,
            message,
            ...(meta || {}),
        };

        if (config.isDeveloping) {
            console[level](JSON.stringify(logData, null, 2));
            return;
        }

        console[level](JSON.stringify(logData));
    }

    debug(message: string, meta?: object) {
        this.log('debug', message, meta);
    }

    info(message: string, meta?: object) {
        this.log('info', message, meta);
    }

    warn(message: string, meta?: object) {
        this.log('warn', message, meta);
    }

    error(message: string, meta?: object) {
        this.log('error', message, meta);
    }
}

export const logger = new Logger();
