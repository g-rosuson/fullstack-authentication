import { defineConfig } from 'vitest/config';

import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        // Enables `describe`, `it`, `expect` globally
        globals: true,          
        // Use Node.js environment (no browser APIs)
        environment: 'node',   
        include: ['src/**/*.test.ts'],
        coverage: {
            reporter: ['text', 'json'],   
        },
    },
});
