import test from 'node:test';
import { throws } from 'node:assert';
import { Durationable, Options } from './schema.ts';
import { Temporal } from 'temporal-polyfill';
import { durationEqual, optionsEqual } from './assert.ts';

const defaultOptions = Object.freeze({
  isEarlyExit: true,
  attemptLimits: 1000,
  waitList: [],
  skipList: [],
  initialDuration: Temporal.Duration.from({ seconds: 10 }),
  leastInterval: Temporal.Duration.from({ seconds: 15 }),
  retryMethod: 'equal_intervals',
  shouldSkipSameWorkflow: false,
  isDryRun: false,
});

test('Options keep given values', () => {
  optionsEqual({
    isEarlyExit: true,
    attemptLimits: 1000,
    waitList: [],
    skipList: [],
    initialDuration: Temporal.Duration.from({ seconds: 10 }),
    leastInterval: Temporal.Duration.from({ seconds: 15 }),
    retryMethod: 'equal_intervals',
    shouldSkipSameWorkflow: false,
    isDryRun: false,
  }, Options.parse(defaultOptions));
});

test('Options set some default values it cannot be defined in action.yml', () => {
  optionsEqual(
    Options.parse({ ...defaultOptions, waitList: [{ workflowFile: 'ci.yml' }] }),
    {
      ...defaultOptions,
      waitList: [{
        workflowFile: 'ci.yml',
        jobMatchMode: 'all',
        optional: false,
        startupGracePeriod: Temporal.Duration.from({ seconds: 10 }),
      }],
    },
  );
});

test('Options reject invalid values', () => {
  throws(() => Options.parse({ ...defaultOptions, leastInterval: Temporal.Duration.from({ seconds: 0 }) }), {
    name: 'ZodError',
    message: /Too short interval for pollings/,
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
    durationEqual(Durationable.parse('PT1M42S'), Temporal.Duration.from({ seconds: 102 }));
    durationEqual(Durationable.parse({ minutes: 1, seconds: 42 }), Temporal.Duration.from({ seconds: 102 }));
  });

  await t.test('it raises an error if given an invalid formats', (_t) => {
    throws(
      () => Durationable.parse('42 minutes'),
      {
        name: 'ZodError',
        message: /invalid_string/,
      },
    );
  });

  await t.test('it raises an error if given an unexpected keys', (_t) => {
    throws(
      () => Durationable.parse({ min: 5 }),
      {
        name: 'ZodError',
        message: /unrecognized_key/,
      },
    );
  });
});

test('wait-list have startupGracePeriod', async (t) => {
  await t.test('it accepts DurationLike objects', (_t) => {
    optionsEqual(
      Options.parse({
        ...defaultOptions,
        waitList: [{ workflowFile: 'ci.yml', startupGracePeriod: Temporal.Duration.from({ minutes: 5 }) }],
      }),
      {
        ...defaultOptions,
        waitList: [{
          workflowFile: 'ci.yml',
          jobMatchMode: 'all',
          optional: false,
          startupGracePeriod: Temporal.Duration.from({ minutes: 5 }),
        }],
      },
    );
  });

  await t.test('it raises a TypeError if given an unexpected keys', { todo: 'TODO: Replace with ZodError' }, (_t) => {
    throws(
      () =>
        Options.parse({
          ...defaultOptions,
          waitList: [{ workflowFile: 'ci.yml', startupGracePeriod: { min: 5 } }],
        }),
      {
        name: 'TypeError',
        message: 'No valid fields: days,hours,microseconds,milliseconds,minutes,months,nanoseconds,seconds,weeks,years',
      },
    );
  });

  await t.test('it raises a ZodError if given an unexpected keys', {
    todo: "TODO: I don't know why using refine appears the native error",
    skip: 'SKIP: To suppress noise',
  }, (_t) => {
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
    optionsEqual(
      Options.parse({
        ...defaultOptions,
        waitList: [{ workflowFile: 'ci.yml', startupGracePeriod: 'PT1M42S' }],
      }),
      {
        ...defaultOptions,
        waitList: [{
          workflowFile: 'ci.yml',
          jobMatchMode: 'all',
          optional: false,
          startupGracePeriod: Temporal.Duration.from({ minutes: 1, seconds: 42 }),
        }],
      },
    );
  });

  await t.test('it raises a ZodError if given value is larger than initial polling time', (_t) => {
    throws(
      () =>
        Options.parse({
          ...defaultOptions,
          initialDuration: Temporal.Duration.from({ seconds: 41 }),
          waitList: [{ workflowFile: 'ci.yml', startupGracePeriod: { seconds: 40 } }],
        }),
      {
        name: 'ZodError',
        message: /A shorter startupGracePeriod waiting for the first poll does not make sense/,
      },
    );
  });

  await t.test('but does not raises errors if given value is as same as default to keep backward compatibility', (_t) => {
    optionsEqual(
      Options.parse({
        ...defaultOptions,
        initialDuration: Temporal.Duration.from({ seconds: 42 }),
        waitList: [{ workflowFile: 'ci.yml', startupGracePeriod: { seconds: 10 } }],
      }),
      {
        ...defaultOptions,
        initialDuration: Temporal.Duration.from({ seconds: 42 }),
        waitList: [{
          workflowFile: 'ci.yml',
          jobMatchMode: 'all',
          optional: false,
          startupGracePeriod: Temporal.Duration.from({ seconds: 10 }),
        }],
      },
    );

    optionsEqual(
      Options.parse({
        ...defaultOptions,
        initialDuration: Temporal.Duration.from({ seconds: 42 }),
        waitList: [{ workflowFile: 'ci.yml' }],
      }),
      {
        ...defaultOptions,
        initialDuration: Temporal.Duration.from({ seconds: 42 }),
        waitList: [{
          workflowFile: 'ci.yml',
          jobMatchMode: 'all',
          optional: false,
          startupGracePeriod: Temporal.Duration.from({ seconds: 10 }),
        }],
      },
    );
  });
});

test('jobMatchMode', async (t) => {
  await t.test('it accepts exact and prefix mode', (_t) => {
    optionsEqual(
      Options.parse({
        ...defaultOptions,
        skipList: [
          {
            workflowFile: 'ci.yml',
            jobName: 'test-',
            jobMatchMode: 'exact',
          },
        ],
      }),
      {
        ...defaultOptions,
        skipList: [{
          workflowFile: 'ci.yml',
          jobName: 'test-',
          jobMatchMode: 'exact',
        }],
      },
    );

    optionsEqual(
      Options.parse({
        ...defaultOptions,
        skipList: [
          {
            workflowFile: 'ci.yml',
            jobName: 'test-',
            jobMatchMode: 'prefix',
          },
        ],
      }),
      {
        ...defaultOptions,
        skipList: [{
          workflowFile: 'ci.yml',
          jobName: 'test-',
          jobMatchMode: 'prefix',
        }],
      },
    );
  });

  await t.test('it raises a ZodError if given an unsupported mode', (_t) => {
    throws(
      () =>
        Options.parse({
          ...defaultOptions,
          skipList: [{ workflowFile: 'ci.yml', jobMatchMode: 'regexp' }],
        }),
      {
        name: 'ZodError',
        message: /invalid_enum_value/,
      },
    );
  });
});
