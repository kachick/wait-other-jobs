import { strictEqual, deepStrictEqual } from 'node:assert';
import { Temporal } from 'temporal-polyfill';

function jsonReplacer(_key: string, value: unknown): unknown {
  if (value instanceof Set) {
    return `Set<${Array.from(value)}>`;
  }

  if (value instanceof Map) {
    return `Map<${Object.fromEntries(value)}>`;
  }

  return value;
}

//   - Object.is() returns `false` even for same total, because they are not idencial
//   - deepStrictEqual returns `true` even for different total because of no properties :<
export function jsonEqual(actual: unknown, expected: unknown) {
  deepStrictEqual(
    JSON.parse(JSON.stringify(convertDurationToRoundedString(actual), jsonReplacer)),
    JSON.parse(JSON.stringify(convertDurationToRoundedString(expected), jsonReplacer)),
  );
}

export function durationEqual(a: Temporal.Duration, b: Temporal.Duration) {
  strictEqual(
    Temporal.Duration.compare(a, b),
    0,
  );
}

type DurationToRoundedString<T> = T extends Temporal.Duration ? string
  : T extends (infer U)[] ? DurationToRoundedString<U>[]
  : T extends object ? { [K in keyof T]: DurationToRoundedString<T[K]> }
  : T;

function convertDurationToRoundedString<T>(input: T): DurationToRoundedString<T>;
function convertDurationToRoundedString(input: unknown): unknown {
  if (input instanceof Temporal.Duration) {
    // Only using .toJSON() is not enough, it does not normalize `seconds: 102` to `PT1M42S`, returns `PT102S`
    return `Temporal.Duration<${input.round({ largestUnit: 'minutes' }).toJSON()}>`;
  }

  // NOTE: Strictly speaking, not correct if having Temporal.Duration
  if (input instanceof Set || input instanceof Map) {
    return input;
  }

  if (Array.isArray(input)) {
    return input.map((item) => convertDurationToRoundedString(item));
  }

  if (typeof input === 'object' && input !== null) {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(input)) {
      const value = (input as Record<string, unknown>)[key];
      result[key] = convertDurationToRoundedString(value);
    }
    return result;
  }

  return input;
}
