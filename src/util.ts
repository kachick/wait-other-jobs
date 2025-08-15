import { Temporal } from 'temporal-polyfill';

export function pick<T extends object, U extends keyof T>(
  base: Readonly<T>,
  keys: Readonly<U[]>,
): Pick<T, U> {
  const result = {} as Pick<T, U>;
  for (const key of keys) {
    result[key] = base[key];
  }
  return result;
}

export function omit<T extends object, U extends keyof T>(
  base: Readonly<T>,
  keys: Readonly<U[]>,
): Omit<T, U> {
  const result = { ...base };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}

export function jsonReplacerForPrettyPrint(_key: string, value: unknown): unknown {
  const v = stringifyDuration(value);

  if (v instanceof Set) {
    return `Set<${Array.from(v)}>`;
  }

  if (v instanceof Map) {
    return `Map<${Object.fromEntries(v)}>`;
  }

  return v;
}

type DurationToRoundedString<T> = T extends Temporal.Duration ? string
  : T extends (infer U)[] ? DurationToRoundedString<U>[]
  : T extends object ? { [K in keyof T]: DurationToRoundedString<T[K]> }
  : T;

// Don't merge this and above jsonReplacerForPrettyPrint. When addressing it, make sure the duration format in output JSON
function stringifyDuration<T>(input: T): DurationToRoundedString<T>;
function stringifyDuration(input: unknown): unknown {
  if (input instanceof Temporal.Duration) {
    // Only using .toJSON() is not enough, it does not normalize `seconds: 102` to `PT1M42S`, returns `PT102S`
    return `Temporal.Duration<${input.round({ largestUnit: 'minutes' }).toJSON()}>`;
  }

  // NOTE: Strictly speaking, not correct if having Temporal.Duration
  if (input instanceof Set || input instanceof Map) {
    return input;
  }

  if (Array.isArray(input)) {
    return input.map((item) => stringifyDuration(item));
  }

  if (typeof input === 'object' && input !== null) {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(input)) {
      const value = (input as Record<string, unknown>)[key];
      result[key] = stringifyDuration(value);
    }
    return result;
  }

  return input;
}
