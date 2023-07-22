import { setTimeout } from 'timers/promises';

// Just aliasing to avoid misusing setTimeout between ES method and timers/promises version.
export const wait = setTimeout;

export const retryMethods = ['exponential_backoff', 'equal_intervals'] as const;
type retryMethod = typeof retryMethods[number];
export const isRetryMethod = (
  method: string,
): method is retryMethod => (([...retryMethods] as string[]).includes(method));

// Taken from MDN
// The maximum is exclusive and the minimum is inclusive
function getRandomInt(min: number, max: number) {
  const flooredMin = Math.ceil(min);
  return Math.floor((Math.random() * (Math.floor(max) - flooredMin)) + flooredMin);
}

// 454356 milliseconds => 7.5725999999999996 minutes => about 7.6 minutes
export function readableDuration(milliseconds: number): string {
  const msecToSec = 1000;
  const secToMin = 60;

  const seconds = milliseconds / msecToSec;
  const minutes = seconds / secToMin;
  const { unit, value, precision }: { unit: string; value: number; precision: number } = minutes >= 1
    ? { unit: 'minutes', value: minutes, precision: 1 }
    : { unit: 'seconds', value: seconds, precision: 0 };
  const adjustor = 10 ** precision;
  return `about ${
    (Math.round(value * adjustor) / adjustor).toFixed(
      precision,
    )
  } ${unit}`;
}

export const MIN_JITTER_MILLISECONDS = 1000;
export const MAX_JITTER_MILLISECONDS = 7000;

export function calcExponentialBackoffAndJitter(
  minIntervalSeconds: number,
  attempts: number,
): number {
  const jitterMilliseconds = getRandomInt(MIN_JITTER_MILLISECONDS, MAX_JITTER_MILLISECONDS);
  return ((minIntervalSeconds * (2 ** (attempts - 1))) * 1000) + jitterMilliseconds;
}

export function getIdleMilliseconds(method: retryMethod, minIntervalSeconds: number, attempts: number): number {
  switch (method) {
    case ('exponential_backoff'):
      return calcExponentialBackoffAndJitter(
        minIntervalSeconds,
        attempts,
      );
    case ('equal_intervals'):
      return minIntervalSeconds * 1000;
    default: {
      const _exhaustiveCheck: never = method;
      return minIntervalSeconds * 1000;
    }
  }
}
