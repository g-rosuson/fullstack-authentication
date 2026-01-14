import { z } from 'zod';

import constants from './constants';

import type { ExecuteFunction } from '../../types';
import type { DescriptionSection, InformationItem, PlatformConfigKey, PlatformConfiguration, Request } from './types';

import { PlaywrightCrawler, RequestQueue } from 'crawlee';
import { Page } from 'playwright';
import { scraperResultSchema } from 'shared/schemas/jobs';
import { kebabToCamel } from 'utils';

/**
 * Scraper tool handler for executing web scraping job operations.
 *
 * Orchestrates the scraping of job listings from configured platforms (e.g., jobs.ch).
 * Uses PlaywrightCrawler to:
 * - Navigate through paginated job listing pages
 * - Extract job detail URLs matching configured glob patterns
 * - Scrape structured data from detail pages (title, description, information, company name)
 * - Handle concurrent request processing with proper error handling
 * - Aggregate results per target and invoke completion callbacks
 */
class Scraper {
    /**
     * Builds the search URL for a platform.
     *
     * @param keywords - Array of keywords to search for
     * @param platformConfiguration - Platform-specific configuration
     * @param page - Optional page number for pagination (defaults to 1, omitted from URL if 1)
     * @returns The complete search URL with encoded query parameters
     */
    private buildRequestUrl(keywords: string[], platformConfiguration: PlatformConfiguration, page: number): string {
        const searchTerm = keywords.join(' ');
        const params = new URLSearchParams({ term: searchTerm, page: page.toString() });
        return `${platformConfiguration.baseUrl}?${params.toString()}`;
    }

    /**
     * Extracts structured description sections from jobs.ch vacancy pages.
     *
     * Parses the description container to extract:
     * - Section titles (from p > strong > span elements)
     * - Content blocks (from p > span or ul > li > span elements)
     * - Handles untitled intro paragraphs before the first section
     * - Skips the first container which contains the "You are a great fit" CTA
     *
     * @param page - Playwright Page instance for DOM access
     * @param platformConfiguration - Platform-specific configuration containing selectors
     * @returns Array of description sections, each containing an optional title and blocks array
     */
    private async getDescriptionFromJobsCh(
        page: Page,
        platformConfiguration: PlatformConfiguration
    ): Promise<DescriptionSection[]> {
        const container = page.locator(platformConfiguration.selectors.descriptionSelector);

        return await container.evaluate((containerElement, selectors) => {
            /**
             * Accumulated sections to return.
             * Each section has an optional title and an array of content blocks.
             */
            const tmpSections: DescriptionSection[] = [];

            /**
             * Current section being built.
             * Null when no section has been started yet (before first title or content).
             */
            let current: DescriptionSection | null = null;

            /**
             * Flag to skip the first container which contains the jobs.ch CTA box.
             */
            let isFirstContainer = true;

            /**
             * Iterate through direct children of the description container.
             * This allows us to skip the first CTA container and process content in order.
             * The container element is passed as a parameter from the locator.evaluate() call.
             */
            const children = Array.from(containerElement.children);

            for (const child of children) {
                /**
                 * Skip the first container which contains the jobs.ch CTA box
                 * with "You are a great fit for this position." text.
                 */
                if (isFirstContainer) {
                    isFirstContainer = false;
                    continue;
                }

                /**
                 * Find all relevant spans within this child element.
                 * Selector matches:
                 * - p > strong > span (section titles)
                 * - p > span (paragraph content)
                 * - ul > li > span (list item content)
                 */
                const spans = Array.from(child.querySelectorAll(selectors.allSpans));

                for (const span of spans) {
                    /**
                     * Extract and trim text content.
                     * Skip empty spans (handles empty span elements).
                     */
                    const text = span.textContent?.trim();

                    if (!text) {
                        continue;
                    }

                    /**
                     * Handle section titles: p > strong > span
                     * When a title is found:
                     * 1. Finalize and push the previous section if it has content
                     * 2. Start a new section with the title
                     */
                    if (span.closest(selectors.titleContainer)) {
                        // Finalize previous section before starting a new one
                        if (current && current.blocks.length > 0) {
                            tmpSections.push(current);
                        }

                        // Start new section with title
                        current = { title: text, blocks: [] };
                        continue;
                    }

                    /**
                     * Handle content blocks: regular paragraphs or list items.
                     * Check parent structure to determine content type.
                     */
                    const parentParagraph = span.closest(selectors.paragraph);
                    const parentListItem = span.closest(selectors.listItem);

                    /**
                     * Regular paragraph content (not a title).
                     * Condition: span is in a p tag, but that p tag doesn't contain a strong element.
                     */
                    if (parentParagraph && !parentParagraph.querySelector(selectors.strong)) {
                        // Initialize untitled section if no current section exists
                        if (!current) {
                            current = { blocks: [] };
                        }

                        current.blocks.push(text);

                        /**
                         * List item content: ul > li > span
                         */
                    } else if (parentListItem) {
                        // Initialize untitled section if no current section exists
                        if (!current) {
                            current = { blocks: [] };
                        }

                        current.blocks.push(text);
                    }
                }
            }

            /**
             * Finalize and push the last section if it has content.
             * This handles the case where the last section doesn't have a following title.
             */
            if (current && current.blocks.length > 0) {
                tmpSections.push(current);
            }

            return tmpSections;
        }, platformConfiguration.selectors.descriptionParsing);
    }

    /**
     * Extracts structured information items from jobs.ch vacancy pages.
     *
     * Parses the info container to extract:
     * - Information items with label and value pairs
     * - Filters out SVG icon spans
     * - Handles jobs.ch specific markup (ul > li > span structure)
     *
     * @param page - Playwright Page instance for DOM access
     * @param platformConfiguration - Platform-specific configuration containing selectors
     * @returns Array of information items, each containing a label and value
     */
    private async getInformationFromJobsCh(page: Page, platformConfiguration: PlatformConfiguration) {
        const container = page.locator(platformConfiguration.selectors.infoSelector);

        return await container.evaluate((containerElement, selectors) => {
            /**
             * Accumulated information items to return.
             * Each item has a label and value.
             */
            const informationItems: Array<{ label: string; value: string }> = [];

            /**
             * Get the list container within the info element.
             * Early return if container or list is not found.
             */
            if (!containerElement) {
                return informationItems;
            }

            const listElement = containerElement.querySelector(selectors.list);

            if (!listElement) {
                return informationItems;
            }

            /**
             * Iterate through list items to extract information.
             */
            const listItems = Array.from(listElement.querySelectorAll(selectors.listItem));

            for (const listItem of listItems) {
                /**
                 * Find all span elements within this list item.
                 */
                const spanElements = Array.from(listItem.querySelectorAll(selectors.span));
                const textSpans: string[] = [];

                /**
                 * Filter out spans that contain SVG (icon spans) and get text content.
                 * Only collect non-empty text spans.
                 */
                for (const spanElement of spanElements) {
                    const hasSvg = spanElement.querySelector(selectors.svg) !== null;

                    if (!hasSvg) {
                        const text = spanElement.textContent?.trim();

                        if (text) {
                            textSpans.push(text);
                        }
                    }
                }

                /**
                 * Create information item from text spans.
                 * jobs.ch markup: first span is label, second span is value.
                 */
                if (textSpans.length >= 2) {
                    informationItems.push({
                        label: textSpans[0],
                        value: textSpans[1],
                    });
                } else if (textSpans.length === 1) {
                    /**
                     * Fallback: if only one span found, use it as value with empty label.
                     */
                    informationItems.push({
                        label: '',
                        value: textSpans[0],
                    });
                }
            }

            return informationItems;
        }, platformConfiguration.selectors.informationParsing);
    }

    /**
     * Extracts company name from jobs.ch vacancy pages.
     *
     * Handles two markup cases:
     * 1. With link: data-cy="company-link" > span (anchor tag with company name)
     * 2. Without link: data-cy="vacancy-logo" > div > span with fw_semibold class
     *
     * @param page - Playwright Page instance for DOM access
     * @returns Information item object with label 'Company' and company name value, or null if not found
     */
    private async getCompanyNameFromJobsCh(
        page: Page,
        platformConfiguration: PlatformConfiguration
    ): Promise<InformationItem | null> {
        const selectors = platformConfiguration.selectors.companyNameParsing;

        /**
         * First try: look for company link (case with anchor tag)
         */
        const companyLink = await page.$(platformConfiguration.selectors.companyNameSelector);

        if (companyLink) {
            const companyName = await companyLink.evaluate((element: Element, spanSelector: string) => {
                const span = element.querySelector(spanSelector);
                return span?.textContent?.trim() || null;
            }, selectors.span);

            if (companyName) {
                return {
                    label: selectors.label,
                    value: companyName,
                };
            }
        }

        /**
         * Second try: look for vacancy-logo container (case without link)
         */
        const vacancyLogo = await page.$(platformConfiguration.selectors.vacancyLogoSelector);

        if (vacancyLogo) {
            const companyName = await vacancyLogo.evaluate(
                (element: Element, selectors: { span: string; svg: string }) => {
                    /**
                     * Find span that doesn't contain an SVG (company name span)
                     */
                    const spans = Array.from(element.querySelectorAll(selectors.span)) as HTMLSpanElement[];

                    for (const span of spans) {
                        const hasSvg = span.querySelector(selectors.svg) !== null;

                        if (!hasSvg) {
                            const text = span.textContent?.trim();

                            if (text) {
                                return text;
                            }
                        }
                    }

                    return null;
                },
                { span: selectors.span, svg: selectors.svg }
            );

            if (companyName) {
                return {
                    label: selectors.label,
                    value: companyName,
                };
            }
        }

        return null;
    }

    /**
     * Executes the scraper tool for given targets.
     */
    async execute({
        tool,
        onTargetFinish,
    }: Parameters<ExecuteFunction<'scraper'>>[0]): ReturnType<ExecuteFunction<'scraper'>> {
        // Determine tracking maps for targets and requests
        const targetToResultsMap = new Map<string, z.infer<typeof scraperResultSchema>[]>();
        const targetToUniqueKeysMap = new Map<string, Set<string>>();
        const completedTargets = new Set<string>();

        /**
         * Determine PlaywrightCrawler request objects for each target and populate the request queue.
         */
        const requestQueue = await RequestQueue.open();
        const requests: Request[] = [];

        for (const target of tool.targets) {
            const keywords = target.keywords || tool.keywords;
            const maxPages = target.maxPages || tool.maxPages;
            const initialPage = 1;

            const targetToCamelCase = kebabToCamel(target.target);
            const platformConfiguration = constants.platformConfiguration[targetToCamelCase as PlatformConfigKey];

            /**
             * Invoke onTargetFinish with error if platform configuration is not found and continue to the next target.
             */
            if (!platformConfiguration) {
                onTargetFinish({
                    targetId: target.id,
                    results: [
                        {
                            result: null,
                            error: {
                                message: `Platform configuration not found for ${target.target}`,
                            },
                        },
                    ],
                });

                continue;
            }

            /**
             * Configuration was found -> add target request objects.
             */
            if (!targetToUniqueKeysMap.has(target.id)) {
                targetToUniqueKeysMap.set(target.id, new Set());
            }

            const requestUrl = this.buildRequestUrl(keywords, platformConfiguration, initialPage);

            requests.push({
                url: requestUrl,
                label: constants.requestLabels.targetRequest,
                userData: {
                    targetId: target.id,
                    platformConfiguration,
                    keywords,
                    maxPages,
                },
            });
        }

        await requestQueue.addRequests(requests);

        /**
         * Initialize the PlaywrightCrawler crawler and start the scraping process.
         */
        const crawler = new PlaywrightCrawler({
            requestQueue,
            // maxRequestRetries defaults to 3
            // NOTE: This runs concurrently (Controlled via concurrency settings) for every request in the request queue.
            requestHandler: async ({ page, request, enqueueLinks }) => {
                // TODO: Validate request data.
                // Determine request information
                const platformConfiguration = request.userData?.platformConfiguration;
                const requestLabel = request.label;
                const targetId = request.userData?.targetId;
                const maxPages = request.userData?.maxPages;

                /**
                 * Handle extraction requests, by scraping page with detail information.
                 */
                const isExtractionRequest = requestLabel === constants.requestLabels.extractionRequest;

                if (isExtractionRequest) {
                    /**
                     * NOTE: PlaywrightCrawler processes requests concurrently, so multiple extraction requests
                     * for the same target may execute simultaneously. This check prevents duplicate processing
                     * and ensures onTargetFinish is only called once per target.
                     */
                    if (completedTargets.has(targetId)) {
                        return;
                    }

                    // Navigate to the request URL and wait for the title selector to be present.
                    await page.goto(request.url);
                    await page.waitForSelector(platformConfiguration.selectors.titleSelector);

                    /**
                     * Extract the title
                     */
                    const title = (await page.textContent(platformConfiguration.selectors.titleSelector)) || '';

                    /**
                     * Extract the description
                     */
                    const description = await this.getDescriptionFromJobsCh(page, platformConfiguration);

                    /**
                     * Extract the information
                     */
                    const information = await this.getInformationFromJobsCh(page, platformConfiguration);

                    /**
                     * Extract company name and add to information.
                     */
                    const companyName = await this.getCompanyNameFromJobsCh(page, platformConfiguration);

                    if (companyName) {
                        information.push(companyName);
                    }

                    /**
                     * Initialize the target results map if it doesn't exist.
                     * And add the result to the map if it does exist.
                     */
                    const isTargetInitialized = targetToResultsMap.has(targetId);

                    if (!isTargetInitialized) {
                        targetToResultsMap.set(targetId, [
                            {
                                result: { url: request.url, title, description, information },
                                error: null,
                            },
                        ]);
                    } else {
                        targetToResultsMap.get(targetId)?.push({
                            result: { url: request.url, title, description, information },
                            error: null,
                        });
                    }

                    targetToUniqueKeysMap.get(targetId)?.delete(request.uniqueKey);

                    /**
                     * Invoke onTargetFinish with complete target results.
                     */
                    const isTargetToUniqueKeysMapEmpty = targetToUniqueKeysMap.get(targetId)?.size === 0;
                    const isTargetCompleted = completedTargets.has(targetId);

                    if (isTargetToUniqueKeysMapEmpty && !isTargetCompleted) {
                        completedTargets.add(targetId);

                        onTargetFinish({
                            targetId,
                            results: targetToResultsMap.get(targetId) || [],
                        });
                    }

                    return;
                }

                /**
                 * Handle target requests by enqueuing extraction requests, to be handled by the extraction logic above.
                 */
                for (let pageIndex = 1; pageIndex <= maxPages; pageIndex++) {
                    // Navigate to the request URL and wait for the results container to be present.
                    await page.goto(this.buildRequestUrl(request.userData.keywords, platformConfiguration, pageIndex));
                    await page.waitForSelector(platformConfiguration.selectors.resultsContainer);

                    // Determine the current URL and check if the page exists.
                    const currentUrl = page.url();

                    // Break the loop when the page does not exist
                    // NOTE: [jobs.ch]: When there are no more pages to navigate to, the page parameter is not included in the URL.
                    const doesPageExist = currentUrl.includes('page=' + pageIndex);

                    if (!doesPageExist) {
                        break;
                    }

                    /**
                     * Enqueue extraction requests and only process requests that adhear to the glob pattern.
                     */
                    const result = await enqueueLinks({
                        label: constants.requestLabels.extractionRequest,
                        selector: platformConfiguration.selectors.itemSelector,
                        globs: platformConfiguration.extractionGlobs,
                        transformRequestFunction: request => {
                            return {
                                ...request,
                                userData: {
                                    ...request.userData,
                                    targetId,
                                    platformConfiguration,
                                },
                            };
                        },
                    });

                    // Only process requests that adhear to the glob pattern.
                    for (const request of result.processedRequests) {
                        const urlSet = targetToUniqueKeysMap.get(targetId);
                        urlSet?.add(request.uniqueKey);
                    }
                }

                /**
                 * Handle the case where no links were found on any page.
                 * @todo: Do we need to handle this?
                 */
                const isTargetToUniqueKeysMapEmpty = targetToUniqueKeysMap.get(targetId)?.size === 0;
                const isTargetCompleted = completedTargets.has(targetId);

                if (isTargetToUniqueKeysMapEmpty && !isTargetCompleted) {
                    completedTargets.add(targetId);

                    onTargetFinish({
                        targetId,
                        results: targetToResultsMap.get(targetId) || [],
                    });
                }
            },
            failedRequestHandler: async ({ request }) => {
                // Determine request information
                const targetId = request.userData?.targetId;
                const requestLabel = request.label;

                /**
                 * NOTE: PlaywrightCrawler processes requests concurrently, so failed requests may arrive
                 * after a target is already marked complete. This check prevents duplicate error handling
                 * and ensures onTargetFinish is only called once per target.
                 */
                if (completedTargets.has(targetId)) {
                    return;
                }

                /**
                 * Return the target request with error if it fails to process.
                 */
                const isTargetRequest = requestLabel === constants.requestLabels.targetRequest;

                if (isTargetRequest) {
                    onTargetFinish({
                        targetId,
                        results: [
                            {
                                result: null,
                                error: {
                                    message:
                                        request.errorMessages?.join('; ') ||
                                        `Failed to process ${request.url} after retries`,
                                },
                            },
                        ],
                    });

                    return;
                }

                /**
                 * Handle extraction requests by returning the extraction request with error if it fails to process.
                 */
                const isExtractionRequest = requestLabel === constants.requestLabels.extractionRequest;

                if (isExtractionRequest) {
                    /**
                     * Check if the extraction request has a unique key and if it does, add the result to the target results map.
                     */
                    const hasUniqueKey =
                        request.uniqueKey && targetToUniqueKeysMap.get(targetId)?.has(request.uniqueKey);

                    if (hasUniqueKey) {
                        if (!targetToResultsMap.has(targetId)) {
                            targetToResultsMap.set(targetId, []);
                        }

                        targetToResultsMap.get(targetId)?.push({
                            result: null,
                            error: {
                                message:
                                    request.errorMessages?.join('; ') ||
                                    `Failed to process ${request.url} after retries`,
                            },
                        });

                        // Remove the unique key from the target unique keys map.
                        targetToUniqueKeysMap.get(targetId)?.delete(request.uniqueKey);

                        /**
                         * Invoke onTargetFinish if all extraction requests for the target are completed.
                         */
                        const isTargetToUniqueKeysMapEmpty = targetToUniqueKeysMap.get(targetId)?.size === 0;
                        const isTargetCompleted = completedTargets.has(targetId);

                        if (isTargetToUniqueKeysMapEmpty && !isTargetCompleted) {
                            completedTargets.add(targetId);

                            onTargetFinish({
                                targetId,
                                results: targetToResultsMap.get(targetId) || [],
                            });
                        }
                    }
                }
            },
        });

        await crawler.run();
    }
}

export default Scraper;
