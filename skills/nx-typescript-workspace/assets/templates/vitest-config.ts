// vitest.config.ts — standard template
// Replace DEPTH_SEGMENTS and PROJECT_PATH before use.
//
// DEPTH_SEGMENTS: count directory segments from workspace root to this file,
//   then join that many '..' with path.resolve.
//   Example: libs/guard/ingestion/domain/ = 4 → '../../../..'
//            apps/guard-api/              = 2 → '../..'
//
// PROJECT_PATH: workspace-relative path to the project directory.
//   Example: libs/guard/ingestion/domain
//            apps/guard-api
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, 'DEPTH_SEGMENTS');

export default defineConfig({
  root: workspaceRoot,
  test: {
    include: [
      'PROJECT_PATH/src/**/*.spec.ts',
      'PROJECT_PATH/src/**/*.test.ts',
    ],
    environment: 'node',
    reporters: ['default'],
    coverage: {
      provider: 'v8',
      reportsDirectory: 'coverage/PROJECT_PATH',
    },
  },
});
