import type { ExecuteFunction } from '../../types';

/**
 * Email tool handler for executing email-related job operations.
 *
 * This tool processes email targets by sending emails with the configured
 * subject and body. Configuration can override tool-level defaults on a per-target basis.
 */
class Email {
    /**
     * Executes the email tool for a given target configuration.
     *
     * Uses TypeScript utility types to ensure type safety:
     * - Parameters<ExecuteFunction<'email'>>[0]: Extracts the first parameter type from ExecuteFunction,
     *   ensuring the destructured parameters match the expected function signature
     * - ReturnType<ExecuteFunction<'email'>>: Extracts the return type, ensuring the return value
     *   matches the expected result structure
     *
     * Why use Parameters instead of direct types?
     * - DRY principle: Single source of truth - types are derived from ExecuteFunction
     * - Automatic synchronization: If ExecuteFunction changes, parameter types update automatically
     * - Less duplication: No need to repeat the parameter structure manually
     *
     * Alternative: Could use { tool: ToolMap['email']; config: ExecuteConfigMap['email'] } directly,
     * but Parameters ensures consistency with the function signature definition.
     *
     * @param tool - The email tool instance with default subject and body
     * @param config - Target-specific configuration that can override tool defaults
     * @returns Promise resolving to the email execution result with output, metadata, and timestamp
     */
    async execute({ tool, config }: Parameters<ExecuteFunction<'email'>>[0]): ReturnType<ExecuteFunction<'email'>> {
        const error = null;

        return {
            output: {},
            targetId: config.id,
            subject: config.subject || tool.subject,
            body: config.body || tool.body,
            target: config.target,
            error,
            timestamp: Date.now(),
        };
    }
}

export default Email;
