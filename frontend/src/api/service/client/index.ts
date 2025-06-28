import { CustomError } from 'services/error';
import { errorSchema } from 'services/error/schemas';

import { type FetchOptions } from './types';

/**
 * Handles non-2xx API responses and parses and validates
 * the error payload against a Zod schema.
 */
const _handleErrorResponse = async (response: Response) => {
    try {
        // Attempt to parse the response body as JSON
        const jsonResponse = await response.json();

        // Validate the shape of error response
        const result = errorSchema.safeParse(jsonResponse.error);
    
        if (!result.success) {
            // If validation fails, throw an error with cause
            throw new CustomError(`[API]: Error response schema is invalid: ${JSON.stringify(result.error)}`, { cause: result.error });
        }

        // If validation succeeds, throw an error with issues
        throw new CustomError(result.data.message, { ...result.data });

    } catch (error) {
        throw new CustomError('[API]: Invalid JSON in error response', { cause: error as Error });
    }
};

/**
 * Makes an HTTP request to the given path and options.
 * And handles errors for non-2xx HTTP responses.
 */
const _fetch = async (path: string , fetchOptions: FetchOptions) => {
    const url = `${window.metadata.backendRootUrl}/api/${path}`;

    const { method, body, headers } = fetchOptions;

    const tmpHeaders = {
        'Content-Type': 'application/json',
        ...headers
    };

    const response = await fetch(url, {
        method,
        credentials: 'include',
        body: body ? JSON.stringify(body) : undefined,
        headers: tmpHeaders
    });

    // Handle non-2xx HTTP responses
    if (!response.ok) {
        _handleErrorResponse(response);
    }

    return await response.json();
};

/**
 * Makes a GET request to the given API path.
 */
const get = async <TResp>(path: string): Promise<TResp> => {
    return await _fetch(path, { method: 'GET' })
};

/**
 * Makes a POST request to the given API path with the given payload.
 */
const post = async <TResp, TBody = undefined>(path: string, body?: TBody): Promise<TResp> => {
    return await _fetch(path, { method: 'POST', body });
};

const client = {
    get,
    post,
};

export default client;