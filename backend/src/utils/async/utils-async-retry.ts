import { logger } from 'aop/logging';

/**
 * Configuration options for retry behavior.
 */
export interface RetryOptions {
    /** Maximum number of retry attempts (default: 3) */
    maxAttempts: number;
    /** Fixed delay in milliseconds between retry attempts (default: 5000) */
    delayMs: number;
    /** Optional operation name for logging purposes */
    operationName?: string;
}

/**
 * Executes an async function with retry logic using a fixed-interval strategy.
 *
 * This utility provides a simple, predictable retry mechanism suitable for
 * database connections and other operations where exponential backoff might
 * cause unnecessarily long waits during startup.
 *
 * @param fn - The async function to execute with retries
 * @param options - Configuration for retry behavior
 * @returns Promise resolving to the result of the function execution
 * @throws The last error if all retry attempts are exhausted
 *
 * @example
 * ```typescript
 * const result = await retryWithFixedInterval(
 *     () => connectToDatabase(),
 *     { maxAttempts: 3, delayMs: 5000, operationName: 'database connection' }
 * );
 * ```
 */
const retryWithFixedInterval = async <T>(fn: () => Promise<T>, options: RetryOptions): Promise<T> => {
    const { maxAttempts, delayMs, operationName = 'operation' } = options;

    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            logger.info(`Executing ${operationName} (attempt ${attempt}/${maxAttempts})`);

            const result = await fn();

            if (attempt > 1) {
                logger.info(`${operationName} succeeded on attempt ${attempt}`);
            }

            return result;
        } catch (error) {
            lastError = error as Error;

            logger.warn(`${operationName} failed on attempt ${attempt}/${maxAttempts}`, {
                error: lastError,
            });

            // Don't wait after the last attempt
            if (attempt < maxAttempts) {
                logger.info(`Waiting ${delayMs}ms before retry...`);
                await new Promise(resolve => setTimeout(resolve, delayMs));
            }
        }
    }

    logger.error(`${operationName} failed after ${maxAttempts} attempts`, {
        error: lastError,
    });

    throw lastError;
};

export { retryWithFixedInterval };
