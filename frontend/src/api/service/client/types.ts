type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type FetchOptions = {
    method?: HttpMethod;
    body?: unknown;
    headers?: Record<string, string>
};

export type {
    FetchOptions,
}