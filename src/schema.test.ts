import test from 'node:test';
import { strictEqual, deepStrictEqual, throws } from 'node:assert';
import { Durationable, Options } from './schema.ts';
import { Temporal } from 'temporal-polyfill';

function assertEualDuration(a: Temporal.Duration, b: Temporal.Duration) {
  strictEqual(
    Temporal.Duration.compare(a, b),
    0,
  );
}

function makeComparableOptions(options: Options): Options {
  return {
    ...options,
    waitList: options.waitList.map((w) => ({
      ...w,
      // Do not use .toJSON(), it does not normalize `seconds: 102` to `PT1M42S`, returns `PT102S`
      startupGracePeriodNano: w.startupGracePeriod.total('nanoseconds'),
    })),
  };
}

// Providing to get better result and diff in cases which have Temporal.Duration
//   - Object.is() returns `false` even for same total, because they are not idencial
//   - deepStrictEqual returns `true` even for different total because of no properties :<
function assertEqualOptions(actual: Options, expected: Options) {
  deepStrictEqual(makeComparableOptions(actual), makeComparableOptions(expected));
}

const defaultOptions = Object.freeze({
  isEarlyExit: true,
  attemptLimits: 1000,
  waitList: [],
  skipList: [],
  waitSecondsBeforeFirstPolling: 10,
  minIntervalSeconds: 15,
  retryMethod: 'equal_intervals',
  shouldSkipSameWorkflow: false,
  isDryRun: false,
});

test('Options keep given values', () => {
  deepStrictEqual({
    isEarlyExit: true,
    attemptLimits: 1000,
    waitList: [],
    skipList: [],
    waitSecondsBeforeFirstPolling: 10,
    minIntervalSeconds: 15,
    retryMethod: 'equal_intervals',
    shouldSkipSameWorkflow: false,
    isDryRun: false,
  }, Options.parse(defaultOptions));
});

test('Options set some default values it cannot be defined in action.yml', () => {
  deepStrictEqual({
    ...defaultOptions,
    waitList: [{
      workflowFile: 'ci.yml',
      optional: false,
      startupGracePeriod: Temporal.Duration.from({ seconds: 101 }),
    }],
  }, Options.parse({ ...defaultOptions, waitList: [{ workflowFile: 'ci.yml' }] }));
});

test('Options reject invalid values', () => {
  throws(() => Options.parse({ ...defaultOptions, minIntervalSeconds: 0 }), {
    name: 'ZodError',
    message: /too_small/,
  });

  throws(() => Options.parse({ ...defaultOptions, attemptLimits: 0 }), {
    name: 'ZodError',
    message: /too_small/,
  });

  throws(() => Options.parse({ ...defaultOptions, retryMethod: 'inverse-exponential-backoff' }), {
    name: 'ZodError',
    message: /invalid_enum_value/,
  });

  throws(() => Options.parse({ ...defaultOptions, waitList: [{ unknownField: ':)' }] }), {
    name: 'ZodError',
    message: /invalid_type/,
  });

  throws(() => Options.parse({ ...defaultOptions, skipList: [{ optional: true }] }), {
    name: 'ZodError',
    message: /invalid_type/,
  });

  throws(
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

test('Durationable', async (t) => {
  await t.test('transformed to Temporal.Duration', (_t) => {
    assertEualDuration(Durationable.parse('PT1M42S'), Temporal.Duration.from({ seconds: 102 }));
  });

  await t.test('it raises an error if given an unexpected keys', (_t) => {
    throws(
      () =>
        Options.parse({
          ...defaultOptions,
          waitList: [{ workflowFile: 'ci.yml', startupGracePeriod: { min: 5 } }],
        }),
      {
        name: 'ZodError',
        message: /unrecognized_key/,
      },
    );
  });

  await t.test('it parses ISO 8601 duration format', (_t) => {
    deepStrictEqual(
      {
        ...defaultOptions,
        waitList: [{
          workflowFile: 'ci.yml',
          optional: false,
          startupGracePeriod: Temporal.Duration.from('PT1M42S'),
        }],
      },
      Options.parse({
        ...defaultOptions,
        waitList: [{ workflowFile: 'ci.yml', startupGracePeriod: 'PT1M42S' }],
      }),
    );
  });
});

test('wait-list have startupGracePeriod', async (t) => {
  await t.test('it accepts DurationLike objects', (_t) => {
    deepStrictEqual(
      {
        ...defaultOptions,
        waitList: [{
          workflowFile: 'ci.yml',
          optional: false,
          startupGracePeriod: Temporal.Duration.from({ minutes: 5 }),
        }],
      },
      Options.parse({
        ...defaultOptions,
        waitList: [{ workflowFile: 'ci.yml', startupGracePeriod: Temporal.Duration.from({ minutes: 5 }) }],
      }),
    );
  });

  await t.test('it raises an error if given an unexpected keys', (_t) => {
    throws(
      () =>
        Options.parse({
          ...defaultOptions,
          waitList: [{ workflowFile: 'ci.yml', startupGracePeriod: { min: 5 } }],
        }),
      {
        name: 'ZodError',
        message: /unrecognized_key/,
      },
    );
  });

  await t.test('it parses ISO 8601 duration format', (_t) => {
    assertEqualOptions(
      Options.parse({
        ...defaultOptions,
        waitList: [{ workflowFile: 'ci.yml', startupGracePeriod: 'PT1M42S' }],
      }),
      {
        ...defaultOptions,
        waitList: [{
          workflowFile: 'ci.yml',
          optional: false,
          startupGracePeriod: Temporal.Duration.from({ minutes: 1, seconds: 42 }),
        }],
      },
    );
  });
});
