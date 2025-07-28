/**
 * Error message sanitizer for security and user experience.
 * Removes sensitive information and provides user-friendly messages.
 */
export class ErrorSanitizer {
    /**
     * List of sensitive patterns that should be sanitized from error messages.
     */
    private static readonly SENSITIVE_PATTERNS = [
        /password/gi,
        /token/gi,
        /secret/gi,
        /key/gi,
        /credential/gi,
        /auth/gi,
        /session/gi,
    ];

    /**
     * List of database error patterns that should be sanitized.
     */
    private static readonly DATABASE_PATTERNS = [
        /duplicate key/gi,
        /constraint/gi,
        /foreign key/gi,
        /syntax error/gi,
        /connection/gi,
    ];

    /**
     * Sanitizes error messages to remove sensitive information.
     *
     * @param message Original error message
     * @param isProduction Whether running in production environment
     * @returns Sanitized error message
     */
    public static sanitizeMessage(message: string, isProduction: boolean = true) {
        if (!isProduction) {
            return message; // Return original message in development
        }

        let sanitizedMessage = message;

        // Replace sensitive patterns with generic messages
        for (const pattern of this.SENSITIVE_PATTERNS) {
            if (pattern.test(sanitizedMessage)) {
                return 'Authentication error occurred';
            }
        }

        // Replace database error patterns with generic messages
        for (const pattern of this.DATABASE_PATTERNS) {
            if (pattern.test(sanitizedMessage)) {
                return 'Database operation failed';
            }
        }

        // Remove file paths and stack trace information
        sanitizedMessage = sanitizedMessage.replace(/\/[^\s]+/g, '[path]');
        sanitizedMessage = sanitizedMessage.replace(/at\s+[^\s]+/g, '[stack]');

        return sanitizedMessage;
    }

    /**
     * Sanitizes error context to remove sensitive information.
     *
     * @param context Original error context
     * @param isProduction Whether running in production environment
     * @returns Sanitized error context
     */
    public static sanitizeContext(context: Record<string, unknown> | undefined, isProduction: boolean = true) {
        if (!context || !isProduction) {
            return context;
        }

        const sanitized: Record<string, unknown> = {};

        for (const [key, value] of Object.entries(context)) {
            // Skip sensitive keys
            if (this.SENSITIVE_PATTERNS.some(pattern => pattern.test(key))) {
                continue;
            }

            // Sanitize string values
            if (typeof value === 'string') {
                sanitized[key] = this.sanitizeMessage(value, isProduction);
            } else if (typeof value === 'object' && value !== null) {
                // Recursively sanitize nested objects
                sanitized[key] = this.sanitizeContext(value as Record<string, unknown>, isProduction);
            } else {
                sanitized[key] = value;
            }
        }

        return sanitized;
    }
}
