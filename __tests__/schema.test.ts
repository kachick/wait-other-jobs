import test from 'node:test';
import { throws } from 'node:assert';
import { Durationable, Options } from '../src/schema.ts';
import { Temporal } from 'temporal-polyfill';
import { durationEqual, jsonEqual } from './assert.ts';

const defaultOptions = Object.freeze({
  apiUrl: 'https://api.github.com',
  isEarlyExit: true,
  attemptLimits: 1000,
  waitList: [],
  skipList: [],
  warmupDelay: Temporal.Duration.from({ seconds: 1 }),
  minimumInterval: Temporal.Duration.from({ seconds: 10 }),
  retryMethod: 'equal_intervals',
  shouldSkipSameWorkflow: false,
  isDryRun: false,
  eventNames: new Set(['push', 'pull_request']),
});

test('Options keep given values', () => {
  jsonEqual({
    apiUrl: 'https://api.github.com',
    isEarlyExit: true,
    attemptLimits: 1000,
    waitList: [],
    skipList: [],
    warmupDelay: Temporal.Duration.from({ seconds: 1 }),
    minimumInterval: Temporal.Duration.from({ seconds: 10 }),
    retryMethod: 'equal_intervals',
    shouldSkipSameWorkflow: false,
    isDryRun: false,
    eventNames: new Set(['push', 'pull_request']),
  }, Options.parse(defaultOptions));
});

test('Options set some default values it cannot be defined in action.yml', () => {
  jsonEqual(
    Options.parse({ ...defaultOptions, waitList: [{ workflowFile: 'ci.yml' }] }),
    {
      ...defaultOptions,
      waitList: [{
        workflowFile: 'ci.yml',
        jobMatchMode: 'all',
        optional: false,
        startupGracePeriod: Temporal.Duration.from({ seconds: 10 }),
        eventNames: new Set([]),
      }],
    },
  );
});

test('Options accept all yaml extensions', () => {
  jsonEqual(
    Options.parse({ ...defaultOptions, waitList: [{ workflowFile: 'ci.yml' }] }),
    {
      ...defaultOptions,
      waitList: [{
        workflowFile: 'ci.yml',
        jobMatchMode: 'all',
        optional: false,
        startupGracePeriod: Temporal.Duration.from({ seconds: 10 }),
        eventNames: new Set([]),
      }],
    },
  );

  jsonEqual(
    Options.parse({ ...defaultOptions, waitList: [{ workflowFile: 'ci.yaml' }] }),
    {
      ...defaultOptions,
      waitList: [{
        // https://github.com/github/docs/blob/52d198a935e66623de173fa914bb01cd0ce0a255/content/actions/writing-workflows/workflow-syntax-for-github-actions.md?plain=1#L22
        workflowFile: 'ci.yaml',
        jobMatchMode: 'all',
        optional: false,
        startupGracePeriod: Temporal.Duration.from({ seconds: 10 }),
        eventNames: new Set([]),
      }],
    },
  );
});

test('It can start immediately. GH-994', () => {
  jsonEqual(
    Options.parse({ ...defaultOptions, warmupDelay: Temporal.Duration.from({ seconds: 0 }) }),
    {
      ...defaultOptions,
      warmupDelay: Temporal.Duration.from({ seconds: 0 }),
    },
  );
});

test('Options reject invalid values', () => {
  throws(() => Options.parse({ ...defaultOptions, warmupDelay: Temporal.Duration.from({ seconds: -1 }) }), {
    name: 'ZodError',
    message: /Negative intervals are not reasonable for pollings/,
  });

  throws(() => Options.parse({ ...defaultOptions, minimumInterval: Temporal.Duration.from({ seconds: 0 }) }), {
    name: 'ZodError',
    message: /Too short interval for pollings/,
  });

  throws(() => Options.parse({ ...defaultOptions, attemptLimits: 0 }), {
    name: 'ZodError',
    message: /too_small/,
  });

  throws(() => Options.parse({ ...defaultOptions, retryMethod: 'inverse-exponential-backoff' }), {
    name: 'ZodError',
    message: /invalid_value/,
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

  throws(
    () =>
      Options.parse({
        ...defaultOptions,
        waitList: [{ workflowFile: 'ci.toml' }],
      }),
    {
      name: 'ZodError',
      message: /Invalid string: must end with /,
    },
  );
});

test('Durationable', async (t) => {
  await t.test('transformed to Temporal.Duration', (_t) => {
    durationEqual(Durationable.parse('PT1M42S'), Temporal.Duration.from({ seconds: 102 }));
    durationEqual(
      Durationable.parse(Temporal.Duration.from({ minutes: 1, seconds: 42 })),
      Temporal.Duration.from({ seconds: 102 }),
    );
  });

  await t.test('it raises an error if given an invalid formats', (_t) => {
    throws(
      () => Durationable.parse('42 minutes'),
      {
        name: 'ZodError',
        message: /invalid_format/,
      },
    );
  });
});

test('wait-list have startupGracePeriod', async (t) => {
  await t.test('it accepts DurationLike objects', (_t) => {
    jsonEqual(
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
          eventNames: new Set([]),
        }],
      },
    );
  });

  await t.test('it raises an error if given an unexpected format', (_t) => {
    throws(
      () =>
        Options.parse({
          ...defaultOptions,
          waitList: [{ workflowFile: 'ci.yml', startupGracePeriod: '5M' }],
        }),
      {
        name: 'RangeError',
        message: /Cannot parse:.+\b5M\b/,
      },
    );
  });

  await t.test('it parses ISO 8601 duration format', (_t) => {
    jsonEqual(
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
          eventNames: new Set([]),
        }],
      },
    );
  });

  await t.test('it raises a ZodError if given value is larger than initial polling time', (_t) => {
    throws(
      () =>
        Options.parse({
          ...defaultOptions,
          warmupDelay: Temporal.Duration.from({ seconds: 41 }),
          waitList: [{ workflowFile: 'ci.yml', startupGracePeriod: 'PT40S' }],
        }),
      {
        name: 'ZodError',
        message: /A shorter startupGracePeriod waiting for the first poll does not make sense/,
      },
    );
  });

  await t.test('but does not raises errors if given value is as same as default to keep backward compatibility', (_t) => {
    jsonEqual(
      Options.parse({
        ...defaultOptions,
        warmupDelay: Temporal.Duration.from({ seconds: 42 }),
        waitList: [{ workflowFile: 'ci.yml', startupGracePeriod: 'PT10S' }],
      }),
      {
        ...defaultOptions,
        warmupDelay: Temporal.Duration.from({ seconds: 42 }),
        waitList: [{
          workflowFile: 'ci.yml',
          jobMatchMode: 'all',
          optional: false,
          startupGracePeriod: Temporal.Duration.from({ seconds: 10 }),
          eventNames: new Set([]),
        }],
      },
    );

    jsonEqual(
      Options.parse({
        ...defaultOptions,
        warmupDelay: Temporal.Duration.from({ seconds: 42 }),
        waitList: [{ workflowFile: 'ci.yml' }],
      }),
      {
        ...defaultOptions,
        warmupDelay: Temporal.Duration.from({ seconds: 42 }),
        waitList: [{
          workflowFile: 'ci.yml',
          jobMatchMode: 'all',
          optional: false,
          startupGracePeriod: Temporal.Duration.from({ seconds: 10 }),
          eventNames: new Set([]),
        }],
      },
    );
  });
});

test('wait-list item have deprecated eventName field', async (t) => {
  await t.test('converts to eventNames', (_t) => {
    jsonEqual(
      Options.parse({
        ...defaultOptions,
        waitList: [{
          workflowFile: 'ci.yml',
          startupGracePeriod: Temporal.Duration.from({ minutes: 5 }),
          eventName: 'push',
        }],
      }),
      {
        ...defaultOptions,
        waitList: [{
          workflowFile: 'ci.yml',
          jobMatchMode: 'all',
          optional: false,
          startupGracePeriod: Temporal.Duration.from({ minutes: 5 }),
          eventNames: new Set(['push']),
        }],
      },
    );
  });
});

test('jobMatchMode', async (t) => {
  await t.test('it accepts exact and prefix mode', (_t) => {
    jsonEqual(
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

    jsonEqual(
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
        message: /invalid_value/,
      },
    );
  });
});
