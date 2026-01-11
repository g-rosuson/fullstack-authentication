import type { ExecuteFunction } from '../../types';

import { PlaywrightCrawler, RequestQueue } from 'crawlee';

// TODO: 1. How can we return the results and errors from a target, before continuing to the next target?
// TODO: And handle pagination?

// TODO: jobs.ch uses url state to render content: https://www.jobs.ch/en/vacancies/?term=frontend%20developer

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
    async execute({ tool }: Parameters<ExecuteFunction<'scraper'>>[0]): ReturnType<ExecuteFunction<'scraper'>> {
        const requests = tool.targets.map(target => ({
            url: target.target,
            metadata: {
                keywords: target.keywords || tool.keywords,
            },
            targetId: target.id,
        }));

        const requestQueue = await RequestQueue.open();
        await requestQueue.addRequests(requests);

        const crawler = new PlaywrightCrawler({
            requestQueue,
            async requestHandler({ page, request }) {
                await page.goto(request.url);

                // Find search input and enter keywords if provided
                const keywords = request.userData?.keywords as string[] | undefined;

                if (keywords && keywords.length > 0) {
                    // const searchQuery = keywords.join(' ');
                }
            },
        });

        await crawler.run();
    }
}

export default Scraper;
