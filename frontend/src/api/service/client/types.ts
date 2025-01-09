type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type CredentialPayload = {
    email: string;
    password: string;
}

type HttpOptions = {
    method: HttpMethod;
    body?: object;
    headers?: Record<string, string>
};

type Payload = CredentialPayload | undefined;

export type {
    HttpOptions,
    Payload
}