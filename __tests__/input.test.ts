import { deepStrictEqual, throws } from 'node:assert/strict';
import { describe, it } from 'node:test';
import { eventNames, jsonInput } from '../src/schema.ts';

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
