declare global {
    interface Window {
        metadata: {
            backendRootUrl: 'http://localhost:1000' | 'https://my-url';
            isDeveloping: boolean;
        }
    }
}

// This is necessary to make the file a module
export {};