import test from 'node:test';
import { eventNames, jsonInput } from '../src/schema.ts';
import { throws, deepStrictEqual } from 'node:assert/strict';

test('jsonInput', async (t) => {
  await t.test('it accepts exact and prefix mode', (_t) => {
    deepStrictEqual(jsonInput.parse('42'), 42);
    deepStrictEqual(jsonInput.parse('["foo", 42]'), ['foo', 42]);

    throws(
      () => jsonInput.parse('["foo", 42,]'),
      {
        name: 'ZodError',
        message: /Trailing comma/,
      },
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
