import type { Config } from 'jest';

const config: Config = {
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
module.exports = config;
