import { deepStrictEqual, throws } from 'node:assert/strict';
import { describe, it } from 'node:test';
import { Temporal } from 'temporal-polyfill';
import { resolveRuntimeOptions } from '../src/input.ts';
import { ConfigOptions, eventNames, jsonInput } from '../src/schema.ts';
import { defaultOptions } from './schema.test.ts';

describe('jsonInput', () => {
  it('parses a valid JSON string for a primitive or an array', () => {
    deepStrictEqual(jsonInput.parse('42'), 42);
    deepStrictEqual(jsonInput.parse('["foo", 42]'), ['foo', 42]);
  });

  it('allows trailing commas', () => {
    deepStrictEqual(jsonInput.parse('["foo",,, 42,]'), ['foo', 42]);
  });

  it('allows comments in JSON', () => {
    deepStrictEqual(
      jsonInput.parse(`
          ["foo",
          # Answer to the Ultimate Question of Life, the Universe, and Everything
          42]
        `),
      ['foo', 42],
    );
  });
});

describe('event-list', () => {
  it('parses valid values', () => {
    deepStrictEqual(eventNames.parse(jsonInput.parse('[]')), new Set());

    deepStrictEqual(eventNames.parse(jsonInput.parse('["push", "pull_request"]')), new Set(['push', 'pull_request']));
  });

  it('raises error for invalid inputs', () => {
    throws(
      () => eventNames.parse(jsonInput.parse('[42]')),
      {
        name: 'ZodError',
        message: /invalid_type/,
      },
    );
  });
});

describe('resolveRuntimeOptions', () => {
  it('inherits global event names if not specified in wait-list', () => {
    const configOptions = ConfigOptions.parse({
      ...defaultOptions,
      eventNames: new Set(['push']),
      waitList: [
        {
          workflowFile: 'ci.yml',
          jobMatchMode: 'all',
          optional: false,
          startupGracePeriod: Temporal.Duration.from({ seconds: 10 }),
        },
      ],
      skipList: [],
    });

    const runtimeOptions = resolveRuntimeOptions(configOptions);

    deepStrictEqual(runtimeOptions.waitList[0]?.eventNames, new Set(['push']));
  });

  it('inherits global event names if not specified in skip-list', () => {
    const configOptions = ConfigOptions.parse({
      ...defaultOptions,
      eventNames: new Set(['push']),
      waitList: [],
      skipList: [
        {
          workflowFile: 'other.yml',
          jobMatchMode: 'all',
        },
      ],
    });

    const runtimeOptions = resolveRuntimeOptions(configOptions);

    deepStrictEqual(runtimeOptions.skipList[0]?.eventNames, new Set(['push']));
  });

  it('uses specified event names if provided', () => {
    const configOptions = ConfigOptions.parse({
      ...defaultOptions,
      eventNames: new Set(['push']),
      waitList: [
        {
          workflowFile: 'ci.yml',
          jobMatchMode: 'all',
          optional: false,
          startupGracePeriod: Temporal.Duration.from({ seconds: 10 }),
          eventNames: new Set(['pull_request']),
        },
      ],
    });

    const runtimeOptions = resolveRuntimeOptions(configOptions);

    deepStrictEqual(runtimeOptions.waitList[0]?.eventNames, new Set(['pull_request']));
  });
});
