import { strictEqual, deepStrictEqual } from 'node:assert';
import { Temporal } from 'temporal-polyfill';
import { Options } from '../src/schema.ts';

export function jsonEqual(actual: unknown, expected: unknown) {
  deepStrictEqual(JSON.parse(JSON.stringify(actual)), expected);
}

export function durationEqual(a: Temporal.Duration, b: Temporal.Duration) {
  strictEqual(
    Temporal.Duration.compare(a, b),
    0,
  );
}

function makeComparableOptions(options: Options): Options {
  return JSON.parse(JSON.stringify(options, (_key, value) => {
    if (value instanceof Temporal.Duration) {
      // Do not use .toJSON(), it does not normalize `seconds: 102` to `PT1M42S`, returns `PT102S`
      return value.total('nanoseconds');
    }
    return value;
  }));
}

// Providing to get better result and diff in cases which have Temporal.Duration
//   - Object.is() returns `false` even for same total, because they are not idencial
//   - deepStrictEqual returns `true` even for different total because of no properties :<
export function optionsEqual(actual: Options, expected: Options) {
  deepStrictEqual(makeComparableOptions(actual), makeComparableOptions(expected));
}
