import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default {
  resolve: {
    alias: {
      '@authms/core': resolve(__dirname, '../core/src/index.ts'),
      '@authms/react': resolve(__dirname, '../react/src/index.ts'),
    },
  },
  test: {
    environment: 'node',
    globals: false,
    include: ['src/**/*.test.{ts,tsx}'],
  },
};
