import { throws } from 'node:assert';
import { describe, it } from 'node:test';
import { Temporal } from 'temporal-polyfill';

import { Durationable, Options } from '../src/schema.ts';

import { durationEqual, jsonEqual } from './assert.ts';

const defaultOptions = Object.freeze({
  apiUrl: 'https://api.github.com',
  isEarlyExitEnabled: true,
  attemptLimits: 1000,
  waitList: [],
  skipList: [],
  warmupDelay: Temporal.Duration.from({ seconds: 1 }),
  minimumInterval: Temporal.Duration.from({ seconds: 10 }),
  retryMethod: 'equal_intervals',
  eventNames: new Set(['push', 'pull_request']),
  isSkipSameWorkflowEnabled: false,
  isDryRunEnabled: false,
});

describe('Options', () => {
  it('preserves given option values', () => {
    jsonEqual({
      apiUrl: 'https://api.github.com',
      isEarlyExitEnabled: true,
      attemptLimits: 1000,
      waitList: [],
      skipList: [],
      warmupDelay: Temporal.Duration.from({ seconds: 1 }),
      minimumInterval: Temporal.Duration.from({ seconds: 10 }),
      retryMethod: 'equal_intervals',
      eventNames: new Set(['push', 'pull_request']),
      isSkipSameWorkflowEnabled: false,
      isDryRunEnabled: false,
    }, Options.parse(defaultOptions));
  });

  it('sets default values for options not definable in action.yml', () => {
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

  it('accepts both .yml and .yaml extensions for workflow files', () => {
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

  it('allows starting immediately with zero warmup delay (GH-994)', () => {
    jsonEqual(
      Options.parse({ ...defaultOptions, warmupDelay: Temporal.Duration.from({ seconds: 0 }) }),
      {
        ...defaultOptions,
        warmupDelay: Temporal.Duration.from({ seconds: 0 }),
      },
    );
  });

  it('rejects invalid option values', () => {
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
});

describe('Durationable', () => {
  it('transforms a duration string to a Temporal.Duration object', () => {
    durationEqual(Durationable.parse('PT1M42S'), Temporal.Duration.from({ seconds: 102 }));
    durationEqual(
      Durationable.parse(Temporal.Duration.from({ minutes: 1, seconds: 42 })),
      Temporal.Duration.from({ seconds: 102 }),
    );
  });

  it('raises an error for invalid duration formats', () => {
    throws(
      () => Durationable.parse('42 minutes'),
      {
        name: 'ZodError',
        message: /invalid_format/,
      },
    );
  });
});

describe('Options with wait-list', () => {
  describe('startupGracePeriod', () => {
    it('accepts Temporal.Duration objects', () => {
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

    it('raises an error for unexpected duration formats', () => {
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

    it('parses ISO 8601 duration format strings', () => {
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

    it('raises an error if grace period is shorter than warmup delay', () => {
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

    it('does not raise an error for backward compatibility when grace period is the default', () => {
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
});

describe('wait-list item have deprecated eventName field', () => {
  it('converts to eventNames', () => {
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

describe('jobMatchMode', () => {
  it('accepts "exact" and "prefix" match modes', () => {
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
          eventNames: new Set([]),
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
          eventNames: new Set([]),
        }],
      },
    );
  });

  it('raises an error for unsupported match modes', () => {
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
