import { type HttpOptions, type Payload } from './types';

/**
 * Makes an HTTP request to the given path and options.
 * And handles errors for non-2xx HTTP responses.
 */
const _fetch = async (path: string , httpOptions: HttpOptions) => {
    const url = `${window.metadata.backendRootUrl}/api/${path}`;

    const { method, body, headers } = httpOptions;

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

        const loggingMessage = `[API]: "${method}" request to "${url}" path, failed with message: \n "${jsonResponse.error.message}"`;

        throw new Error(loggingMessage);
    }

    return await response.json();
}

/**
 * Makes a GET request to the given API path.
 */
const get = async (path: string) => {
    return await _fetch(path, { method: 'GET' })
};

/**
 * Makes a POST request to the given API path with the given payload.
 */
const post = async (path: string, payload: Payload = undefined) => {
    return await _fetch(path, { method: 'POST', body: payload })
};

const client = {
    get,
    post,
};

export default client;