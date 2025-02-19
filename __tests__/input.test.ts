import test from 'node:test';
import { jsonInput } from '../src/schema.ts';
import { throws, deepStrictEqual } from 'node:assert/strict';

test('jsonInput', () => {
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
