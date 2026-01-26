import type { DescriptionSection, InformationItem, RequestUserData } from '../../../types';
import type { Dictionary, PlaywrightCrawlingContext, Request } from 'crawlee';
import type { Page } from 'playwright';

/**
 * An enqueue links type.
 */
type EnqueueLinksType = PlaywrightCrawlingContext<Dictionary>['enqueueLinks'];

/**
 * A process request options interface.
 */
interface ProcessRequestOptions {
    page: Page;
    request: Request;
    userData: RequestUserData;
    enqueueLinks: EnqueueLinksType;
}

/**
 * A process request result type.
 */
type ProcessRequestResult =
    | { uniqueKeys: string[]; result: null }
    | {
          uniqueKeys: null;
          result: { url: string; title: string; description: DescriptionSection[]; information: InformationItem[] };
      }
    | { uniqueKeys: null; result: null; error: Error };

export type { ProcessRequestOptions, ProcessRequestResult };
