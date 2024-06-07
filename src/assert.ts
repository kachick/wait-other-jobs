import { strictEqual, deepStrictEqual } from 'node:assert';
import { Temporal } from 'temporal-polyfill';
import { Options } from './schema.ts';

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
  return {
    ...options,
    waitList: options.waitList.map((w) => ({
      ...w,
      // Do not use .toJSON(), it does not normalize `seconds: 102` to `PT1M42S`, returns `PT102S`
      startupGracePeriodNano: w.startupGracePeriod.total('nanoseconds'),
    })),
  };
}

// Providing to get better result and diff in cases which have Temporal.Duration
//   - Object.is() returns `false` even for same total, because they are not idencial
//   - deepStrictEqual returns `true` even for different total because of no properties :<
export function optionsEqual(actual: Options, expected: Options) {
  deepStrictEqual(makeComparableOptions(actual), makeComparableOptions(expected));
}
