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

// Providing to get better result and diff in cases which have Temporal.Duration
//   - Object.is() returns `false` even for same total, because they are not idencial
//   - deepStrictEqual returns `true` even for different total because of no properties :<
export function optionsEqual(actual: Options, expected: Options) {
  deepStrictEqual(convertDurationToNanoseconds(actual), convertDurationToNanoseconds(expected));
}

type DurationToNanoseconds<T> = T extends Temporal.Duration ? string
  : T extends (infer U)[] ? DurationToNanoseconds<U>[]
  : T extends object ? { [K in keyof T]: DurationToNanoseconds<T[K]> }
  : T;

function convertDurationToNanoseconds<T>(input: T): DurationToNanoseconds<T>;
function convertDurationToNanoseconds(input: unknown): unknown {
  if (input instanceof Temporal.Duration) {
    // Only using .toJSON() is not enough, it does not normalize `seconds: 102` to `PT1M42S`, returns `PT102S`
    return `Temporal.Duration<${input.round({ largestUnit: 'minutes' }).toJSON()}>`;
  }

  if (Array.isArray(input)) {
    return input.map((item) => convertDurationToNanoseconds(item));
  }

  if (typeof input === 'object' && input !== null) {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(input)) {
      const value = (input as Record<string, unknown>)[key];
      result[key] = convertDurationToNanoseconds(value);
    }
    return result;
  }

  return input;
}
