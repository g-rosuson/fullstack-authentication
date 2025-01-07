const GET = (path: string) => {
    return fetch(window.metadata.backendRootUrl + path, {
        headers: {
            'Content-Type': 'application/json'
        },
    });
};

const POST = (path: string, body: object) => {
    return fetch(window.metadata.backendRootUrl + path, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    });
};

const client = {
    GET,
    POST,
};

export default client;