import { deepStrictEqual } from 'node:assert/strict';
import test from 'node:test';
import { jsonInput } from '../src/schema.ts';

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
