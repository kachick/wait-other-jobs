import { deepStrictEqual } from 'node:assert/strict';
import { describe, it } from 'node:test';
import { jsonInput } from '../src/schema.ts';

describe('jsonInput', () => {
  it('parses a simple value', () => {
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
