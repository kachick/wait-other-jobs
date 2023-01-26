import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  transform: {
    '^.+\\.(t|j)sx?$': [
      'esbuild-jest-transform',
      {
        'target': 'node16',
        'packages': 'external',
      },
    ],
  },
  extensionsToTreatAsEsm: ['.ts'],
  testMatch: ['**/__tests__/prebuild/**/*.test.ts'],
};
export default config;
