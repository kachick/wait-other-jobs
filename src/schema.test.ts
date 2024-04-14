import test from 'node:test';
import assert from 'node:assert';
import { Options } from './schema.ts';
import { optional } from 'zod';
import { wait } from './wait.ts';

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

test('Options keep given values', () => {
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

test('Options set some default values it cannot be defined in action.yml', () => {
  assert.deepStrictEqual({
    ...defaultOptions,
    waitList: [{ workflowFile: 'ci.yml', optional: false }],
  }, Options.parse({ ...defaultOptions, waitList: [{ workflowFile: 'ci.yml' }] }));
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

  assert.throws(() => Options.parse({ ...defaultOptions, waitList: [{ unknownField: ':)' }] }), {
    name: 'ZodError',
    message: /invalid_type/,
  });

  assert.throws(() => Options.parse({ ...defaultOptions, skipList: [{ optional: true }] }), {
    name: 'ZodError',
    message: /invalid_type/,
  });

  assert.throws(
    () =>
      Options.parse({
        ...defaultOptions,
        waitList: [{ workflowFile: 'ci.yml' }],
        skipList: [{ workflowFile: 'release.yml' }],
      }),
    {
      name: 'ZodError',
      message: /Do not specify both wait-list and skip-list/,
    },
  );
});
