import { CustomError } from 'services/error';
import { errorSchema } from 'services/error/schemas';

import { type FetchOptions } from './types';

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

    const options = {
        method,
        credentials: 'include',
        body: body ? JSON.stringify(body) : undefined,
        headers: tmpHeaders
    } as RequestInit;

    const response = await fetch(url, options);

    // Handle non-2xx HTTP responses
    if (!response.ok) {
        const jsonResponse = await response.json();

        const result = errorSchema.safeParse(jsonResponse.error);

        if (!result.success) {
            throw new CustomError(`[API]: "${method}" request to "${url}" path failed`);
        }

        throw new CustomError(result.data.message, result.data.issues);
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