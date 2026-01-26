import { z } from 'zod';

import { parseSchema } from 'lib/validation';

import constants from './constants';

import type { ExecuteFunction } from '../../types';
import type { Request } from './types';

import { requestUserDataSchema } from './schemas';
import targetRegistry from './targets';
import { PlaywrightCrawler, RequestQueue } from 'crawlee';
import { scraperResultSchema } from 'shared/schemas/jobs';
import { kebabToCamelCase } from 'utils';

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
     * Safely retrieves a target from the registry with runtime validation.
     * @param targetName - The camelCase name of the target
     * @returns The target instance or null if not found
     */
    private getTargetFromRegistry(targetName: string): (typeof targetRegistry)[keyof typeof targetRegistry] | null {
        const key = targetName as keyof typeof targetRegistry;
        return key in targetRegistry ? targetRegistry[key] : null;
    }

    /**
     * Executes the scraper tool for given targets.
     */
    async execute({
        tool,
        onTargetFinish,
    }: Parameters<ExecuteFunction<'scraper'>>[0]): ReturnType<ExecuteFunction<'scraper'>> {
        // Determine tracking maps for targets and requests
        const targetToUniqueKeysMap = new Map<string, Set<string>>();
        const targetToResultsMap = new Map<string, z.infer<typeof scraperResultSchema>[]>();
        const completedTargets = new Set<string>();

        /**
         * Callback function to invoke onTargetFinish with the target results.
         * @param targetId - The ID of the target.
         * @param results - The results of the target.
         */
        function callbackWithTargetResults(targetId: string, results: z.infer<typeof scraperResultSchema>[]) {
            onTargetFinish({
                targetId,
                results,
            });
        }

        /**
         * Determine PlaywrightCrawler request objects for each target and populate the request queue.
         */
        const requestQueue = await RequestQueue.open();
        const requests: Request[] = [];

        for (const targetSettings of tool.targets) {
            const keywords = targetSettings.keywords || tool.keywords;
            const maxPages = targetSettings.maxPages || tool.maxPages;

            targetToUniqueKeysMap.set(targetSettings.id, new Set());
            targetToResultsMap.set(targetSettings.id, []);

            requests.push({
                url: constants.placeholderUrl,
                userData: {
                    label: constants.requestLabels.targetRequest,
                    targetId: targetSettings.id,
                    target: targetSettings.target,
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
                const targetId = request.userData.targetId;
                const userDataResult = parseSchema(requestUserDataSchema, request.userData);

                /**
                 * Validate the request user data and either:
                 * - Invoke onTargetFinish with an error if the request user data is invalid.
                 * - Add a result to the "targetToResultsMap" map with a null result and an error.
                 */
                if (!userDataResult.success) {
                    if (request.userData.label === constants.requestLabels.targetRequest) {
                        callbackWithTargetResults(targetId, [
                            {
                                result: null,
                                error: {
                                    message: `Target request schema validation failed for: ${request.uniqueKey}`,
                                },
                            },
                        ]);

                        completedTargets.add(targetId);
                    } else if (request.userData.label === constants.requestLabels.extractionRequest) {
                        const targetResults = targetToResultsMap.get(targetId);

                        // Note: "targetResults" is initialized when mapping to the initial target requests.
                        targetResults?.push({
                            result: null,
                            error: {
                                message: `Extraction request schema validation failed for: ${request.uniqueKey}`,
                            },
                        });

                        // Remove the unique request key to mark its completion
                        targetToUniqueKeysMap.get(targetId)?.delete(request.uniqueKey);

                        /**
                         * Invoke onTargetFinish with complete target results.
                         */
                        const isTargetToUniqueKeysMapEmpty = targetToUniqueKeysMap.get(targetId)?.size === 0;
                        const isTargetFinished = completedTargets.has(targetId);

                        if (isTargetToUniqueKeysMapEmpty && !isTargetFinished) {
                            completedTargets.add(targetId);
                            callbackWithTargetResults(targetId, targetToResultsMap.get(targetId) || []);
                        }
                    }

                    return;
                }

                /**
                 * Get the user data from the validated request.
                 */
                const userData = userDataResult.data;

                /**
                 * Get the target class from the target registry.
                 * If the target class is not found, invoke onTargetFinish with an error.
                 */
                const targetToCamelCase = kebabToCamelCase(userData.target);
                const target = this.getTargetFromRegistry(targetToCamelCase);

                if (!target) {
                    callbackWithTargetResults(userData.targetId, [
                        {
                            result: null,
                            error: {
                                message: `Could not find target class with name: ${targetToCamelCase}`,
                            },
                        },
                    ]);

                    completedTargets.add(userData.targetId);

                    return;
                }

                /**
                 * Process the request and get the result.
                 */
                const requestResult = await target.processRequest({ page, request, userData, enqueueLinks });

                /**
                 * Add the unique keys of all enqueued extraction requests to the "targetToUniqueKeysMap" map.
                 */
                if (requestResult.uniqueKeys) {
                    for (const uniqueKey of requestResult.uniqueKeys) {
                        // Note: "targetToUniqueKeysMap" is initialized when mapping to the initial target requests.
                        targetToUniqueKeysMap.get(userData.targetId)?.add(uniqueKey);
                    }

                    return;
                    /**
                     * Add the result to the "targetToResultsMap" map.
                     * Note: Its an extraction request when "result" is defined.
                     */
                } else if (requestResult.result) {
                    const targetResults = targetToResultsMap.get(userData.targetId);

                    // Note: "targetResults" is set when mapping to the initial target requests.
                    targetResults?.push({
                        result: requestResult.result,
                        error: null,
                    });

                    // Remove the unique request key to mark its completion
                    targetToUniqueKeysMap.get(userData.targetId)?.delete(request.uniqueKey);

                    /**
                     * Invoke onTargetFinish with complete target results.
                     */
                    const isTargetToUniqueKeysMapEmpty = targetToUniqueKeysMap.get(targetId)?.size === 0;
                    const isTargetFinished = completedTargets.has(userData.targetId);

                    if (isTargetToUniqueKeysMapEmpty && !isTargetFinished) {
                        completedTargets.add(userData.targetId);
                        callbackWithTargetResults(userData.targetId, targetToResultsMap.get(userData.targetId) || []);
                    }

                    return;
                }

                /**
                 * Invoke onTargetFinish with an error when the crawler throws.
                 * Note: "result" is null and "uniqueKeys" is null when this happens.
                 */
                callbackWithTargetResults(userData.targetId, [
                    {
                        result: null,
                        error: {
                            message: `Request processing failed for target with id: ${userData.targetId}`,
                        },
                    },
                ]);

                completedTargets.add(userData.targetId);
            },
        });

        await crawler.run();
    }
}

export default Scraper;
