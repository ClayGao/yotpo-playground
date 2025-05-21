import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react'; // Required if you're testing React components, good to include for Next.js

export default defineConfig({
  plugins: [react()], //
  test: {
    globals: true,
    environment: 'jsdom', // Simulates a browser environment
    setupFiles: [], // Optional: For global setup scripts
    include: ['src/**/*.test.{ts,tsx}'], // Pattern for test files
    coverage: { // Optional: configure coverage reports
      provider: 'v8', // or 'istanbul'
      reporter: ['text', 'json', 'html'],
    },
  },
});
