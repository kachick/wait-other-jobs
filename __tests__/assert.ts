import { deepStrictEqual, strictEqual } from 'node:assert';
import { Temporal } from 'temporal-polyfill';
import { jsonReplacerForPrettyPrint } from '../src/util.ts';

export function jsonEqual(actual: unknown, expected: unknown) {
  deepStrictEqual(
    JSON.parse(JSON.stringify(actual, jsonReplacerForPrettyPrint)),
    JSON.parse(JSON.stringify(expected, jsonReplacerForPrettyPrint)),
  );
}

export function durationEqual(a: Temporal.Duration, b: Temporal.Duration) {
  strictEqual(
    Temporal.Duration.compare(a, b),
    0,
  );
}
