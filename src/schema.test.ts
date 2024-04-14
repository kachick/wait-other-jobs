import test from 'node:test';
import assert from 'node:assert';
import { Options } from './schema.ts';

const defaultOptions = Object.freeze({
  isEarlyExit: true,
  attemptLimits: 1000,
  waitList: [],
  skipList: [],
  waitSecondsBeforeFirstPolling: 15,
  minIntervalSeconds: 10,
  retryMethod: 'equal_intervals',
  shouldSkipSameWorkflow: false,
  isDryRun: false,
});

test('Options keeps given values', () => {
  assert.deepStrictEqual({
    isEarlyExit: true,
    attemptLimits: 1000,
    waitList: [],
    skipList: [],
    waitSecondsBeforeFirstPolling: 15,
    minIntervalSeconds: 10,
    retryMethod: 'equal_intervals',
    shouldSkipSameWorkflow: false,
    isDryRun: false,
  }, Options.parse(defaultOptions));
});

test('Options reject invalid values', () => {
  assert.throws(() => Options.parse({ ...defaultOptions, minIntervalSeconds: 0 }), {
    name: 'ZodError',
    message: /too_small/,
  });

  assert.throws(() => Options.parse({ ...defaultOptions, attemptLimits: 0 }), {
    name: 'ZodError',
    message: /too_small/,
  });

  assert.throws(() => Options.parse({ ...defaultOptions, retryMethod: 'inverse-exponential-backoff' }), {
    name: 'ZodError',
    message: /invalid_enum_value/,
  });
});
