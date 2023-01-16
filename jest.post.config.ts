import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  transform: {
    '^.+\\.(t|j)sx?$': 'esbuild-jest',
  },
  extensionsToTreatAsEsm: ['.ts'],
  testMatch: ['**/__tests__/postbuild/**/*.test.ts'],
};
export default config;
