import type { ExecuteFunction } from '../../types';

/**
 * Scraper tool handler for executing web scraping job operations.
 *
 * This tool processes URL targets by scraping web content based on configured keywords
 * and page limits. Configuration can override tool-level defaults (keywords, maxPages)
 * on a per-target basis, allowing fine-grained control over individual scraping operations.
 */
class Scraper {
    /**
     * Executes the scraper tool for a given target configuration.
     *
     * Uses TypeScript utility types to ensure type safety:
     * - Parameters<ExecuteFunction<'scraper'>>[0]: Extracts the first parameter type from ExecuteFunction,
     *   ensuring the destructured parameters match the expected function signature
     * - ReturnType<ExecuteFunction<'scraper'>>: Extracts the return type, ensuring the return value
     *   matches the expected result structure
     *
     * Why use Parameters instead of direct types?
     * - DRY principle: Single source of truth - types are derived from ExecuteFunction
     * - Automatic synchronization: If ExecuteFunction changes, parameter types update automatically
     * - Less duplication: No need to repeat the parameter structure manually
     *
     * Alternative: Could use { tool: ToolMap['scraper']; config: ExecuteConfigMap['scraper'] } directly,
     * but Parameters ensures consistency with the function signature definition.
     *
     * The method supports per-target overrides for keywords and maxPages, falling back to
     * tool-level defaults when not specified in the configuration.
     *
     * @param tool - The scraper tool instance with default keywords and maxPages
     * @param config - Target-specific configuration that can override tool defaults
     * @returns Promise resolving to the scraping execution result with output, metadata, and timestamp
     */
    async execute({ tool, config }: Parameters<ExecuteFunction<'scraper'>>[0]): ReturnType<ExecuteFunction<'scraper'>> {
        const hasKeywordsOverride = !!config.keywords?.length;
        const hasMaxPagesOverride = config.maxPages && config.maxPages > 0;

        const error = null;

        return {
            output: {},
            targetId: config.id,
            target: config.target,
            keywords: hasKeywordsOverride ? config.keywords! : tool.keywords,
            maxPages: hasMaxPagesOverride ? config.maxPages! : tool.maxPages,
            error,
            timestamp: Date.now(),
        };
    }
}

export default Scraper;
