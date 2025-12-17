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
  isSkipSameWorkflowEnabled: false,
  isDryRunEnabled: false,
});

describe('Options', () => {
  it('keep given values', () => {
    jsonEqual({
      apiUrl: 'https://api.github.com',
      isEarlyExitEnabled: true,
      attemptLimits: 1000,
      waitList: [],
      skipList: [],
      warmupDelay: Temporal.Duration.from({ seconds: 1 }),
      minimumInterval: Temporal.Duration.from({ seconds: 10 }),
      retryMethod: 'equal_intervals',
      isSkipSameWorkflowEnabled: false,
      isDryRunEnabled: false,
    }, Options.parse(defaultOptions));
  });

  it('set some default values it cannot be defined in action.yml', () => {
    jsonEqual(
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

  it('accept all yaml extensions', () => {
    jsonEqual(
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
        }],
      },
    );
  });

  it('can start immediately. GH-994', () => {
    jsonEqual(
      Options.parse({ ...defaultOptions, warmupDelay: Temporal.Duration.from({ seconds: 0 }) }),
      {
        ...defaultOptions,
        warmupDelay: Temporal.Duration.from({ seconds: 0 }),
      },
    );
  });

  it('reject invalid values', () => {
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
  it('transformed to Temporal.Duration', () => {
    durationEqual(Durationable.parse('PT1M42S'), Temporal.Duration.from({ seconds: 102 }));
    durationEqual(
      Durationable.parse(Temporal.Duration.from({ minutes: 1, seconds: 42 })),
      Temporal.Duration.from({ seconds: 102 }),
    );
  });

  it('it raises an error if given an invalid formats', () => {
    throws(
      () => Durationable.parse('42 minutes'),
      {
        name: 'ZodError',
        message: /invalid_format/,
      },
    );
  });
});

describe('wait-list', () => {
  describe('startupGracePeriod', () => {
    it('it accepts DurationLike objects', () => {
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
          }],
        },
      );
    });

    it('it raises an error if given an unexpected format', () => {
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

    it('it parses ISO 8601 duration format', () => {
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
          }],
        },
      );
    });

    it('it raises a ZodError if given value is larger than initial polling time', () => {
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

    it('but does not raises errors if given value is as same as default to keep backward compatibility', () => {
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
          }],
        },
      );
    });
  });
});

describe('jobMatchMode', () => {
  it('it accepts exact and prefix mode', () => {
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

  it('it raises a ZodError if given an unsupported mode', () => {
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
