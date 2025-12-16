import { deepStrictEqual, throws } from 'node:assert/strict';
import test from 'node:test';
import { eventNames, jsonInput } from '../src/schema.ts';

test('jsonInput', (t) => {
  deepStrictEqual(jsonInput.parse('42'), 42);
  deepStrictEqual(jsonInput.parse('["foo", 42]'), ['foo', 42]);

  t.test('allows trailing commas', () => {
    deepStrictEqual(jsonInput.parse('["foo",,, 42,]'), ['foo', 42]);
  });

  t.test('allows comments in JSON', () => {
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

test('event-list', async (t) => {
  await t.test('parses valid values', (_t) => {
    deepStrictEqual(eventNames.parse(jsonInput.parse('[]')), new Set());

    deepStrictEqual(eventNames.parse(jsonInput.parse('["push", "pull_request"]')), new Set(['push', 'pull_request']));
  });

  await t.test('raises error for invalid inputs', (_t) => {
    throws(
      () => eventNames.parse(jsonInput.parse('[42]')),
      {
        name: 'ZodError',
        message: /invalid_type/,
      },
    );
  });
});
