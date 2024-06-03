import { setTimeout } from 'timers/promises';
import { RetryMethod } from './schema.ts';
import { Temporal } from 'temporal-polyfill';

// Just aliasing to avoid misusing setTimeout between ES method and timers/promises version.
export const waitPrimitive = setTimeout;
export function wait(interval: Temporal.Duration) {
  return waitPrimitive(interval.total('milliseconds'));
}

// Taken from MDN
// The maximum is exclusive and the minimum is inclusive
function getRandomInt(min: number, max: number) {
  const flooredMin = Math.ceil(min);
  return Math.floor((Math.random() * (Math.floor(max) - flooredMin)) + flooredMin);
}

export const MIN_JITTER_MILLISECONDS = 1000;
export const MAX_JITTER_MILLISECONDS = 7000;

export function calcExponentialBackoffAndJitter(
  leastInterval: Temporal.Duration,
  attempts: number,
): Temporal.Duration {
  const jitterMilliseconds = getRandomInt(MIN_JITTER_MILLISECONDS, MAX_JITTER_MILLISECONDS);
  return Temporal.Duration.from({
    milliseconds: (leastInterval.total('milliseconds') * (2 ** (attempts - 1))) + jitterMilliseconds,
  });
}

export function getInterval(
  method: RetryMethod,
  leastInterval: Temporal.Duration,
  attempts: number,
): Temporal.Duration {
  switch (method) {
    case ('exponential_backoff'):
      return calcExponentialBackoffAndJitter(
        leastInterval,
        attempts,
      );
    case ('equal_intervals'):
      return leastInterval;
    default: {
      const _exhaustiveCheck: never = method;
      return leastInterval;
    }
  }
}
