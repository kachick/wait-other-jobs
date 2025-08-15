import { strictEqual, deepStrictEqual } from 'node:assert';
import { Temporal } from 'temporal-polyfill';
import { jsonReplacerForPrettyPrint } from '../src/util.ts';

//   - Object.is() returns `false` even for same total, because they are not idencial
//   - deepStrictEqual returns `true` even for different total because of no properties :<
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
