import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['integration/samples/*/specs/**/*.ts', 'integration/watch/*.spec.ts'],
    globals: true,
    sequence: {
      shuffle: false,
    },
  },
});
