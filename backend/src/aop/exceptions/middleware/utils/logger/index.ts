import { ErrorLogContext } from '../../types';

/**
 * Structured error logger for the error handling middleware.
 * Provides consistent logging format across the application.
 */
export class ErrorLogger {
    /**
     * Logs error information with structured context.
     *
     * @param error The error that occurred
     * @param context Additional context information for logging
     */
    public static logError(error: Error, context: ErrorLogContext): void {
        const logEntry = {
            level: 'error',
            timestamp: new Date().toISOString(),
            message: error.message,
            name: error.name,
            statusCode: context.statusCode,
            errorType: context.errorType,
            request: {
                method: context.method,
                url: context.url,
                userAgent: context.userAgent,
                ip: context.ip,
                userId: context.userId,
            },
            stack: context.stack,
            context: context.context,
        };

        // TODO: Integrate with logging service
        console.error(JSON.stringify(logEntry, null, 2));
    }

    /**
     * Logs warning information for non-critical errors.
     *
     * @param message Warning message
     * @param context Additional context information
     */
    public static logWarning(message: string, context: Partial<ErrorLogContext>): void {
        const logEntry = {
            level: 'warning',
            timestamp: new Date().toISOString(),
            message,
            request: {
                method: context.method,
                url: context.url,
                userId: context.userId,
            },
            context: context.context,
        };

        // TODO: Integrate with loggin service
        console.warn(JSON.stringify(logEntry, null, 2));
    }
}
