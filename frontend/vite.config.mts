/// <reference types="vitest" />

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      // Create an alias for sass stylesheet imports
      'stylesheets': path.resolve(__dirname, './src/stylesheets'),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "test/vitest.setup.ts",
  }
})