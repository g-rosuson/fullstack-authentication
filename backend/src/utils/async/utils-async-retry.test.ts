import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { RetryOptions, retryWithFixedInterval } from './utils-async-retry';

// Mock the logger to avoid console output during tests
vi.mock('aop/logging', () => ({
    logger: {
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
    },
}));

describe('retryWithFixedInterval', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should succeed on first attempt', async () => {
        const mockFn = vi.fn().mockResolvedValue('success');
        const options: RetryOptions = { maxAttempts: 3, delayMs: 1000 };

        const result = await retryWithFixedInterval(mockFn, options);

        expect(result).toBe('success');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure and eventually succeed', async () => {
        const mockFn = vi
            .fn()
            .mockRejectedValueOnce(new Error('First failure'))
            .mockRejectedValueOnce(new Error('Second failure'))
            .mockResolvedValue('success');

        const options: RetryOptions = { maxAttempts: 3, delayMs: 1000 };

        const resultPromise = retryWithFixedInterval(mockFn, options);

        // Fast-forward timers to handle delays
        await vi.runAllTimersAsync();

        const result = await resultPromise;

        expect(result).toBe('success');
        expect(mockFn).toHaveBeenCalledTimes(3);
    });

    it('should fail after max attempts', async () => {
        const error = new Error('Persistent failure');
        const mockFn = vi.fn().mockRejectedValue(error);

        const options: RetryOptions = { maxAttempts: 2, delayMs: 1000 };

        // Start the retry logic — this immediately returns a promise.
        // ⚠ This promise may reject later when timers run.
        const resultPromise = retryWithFixedInterval(mockFn, options);

        // Attach the `.rejects` expectation *before* the promise has a chance to reject.
        // This prevents an "Unhandled Rejection" warning from Vitest,
        // because the promise now has a rejection handler attached.
        const expectPromise = expect(resultPromise).rejects.toThrow('Persistent failure');

        // Fast-forward all timers so the retry attempts complete.
        await vi.runAllTimersAsync();

        // Wait for the expectation to resolve (i.e., confirm the promise rejected as expected).
        await expectPromise;

        // Ensure the retry logic actually executed the expected number of times.
        expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('should use default operation name when not provided', async () => {
        const mockFn = vi.fn().mockResolvedValue('success');
        const options: RetryOptions = { maxAttempts: 1, delayMs: 1000 };

        await retryWithFixedInterval(mockFn, options);

        expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should respect custom operation name', async () => {
        const mockFn = vi.fn().mockResolvedValue('success');
        const options: RetryOptions = {
            maxAttempts: 1,
            delayMs: 1000,
            operationName: 'custom operation',
        };

        await retryWithFixedInterval(mockFn, options);

        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
