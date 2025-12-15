import { setTimeout } from 'node:timers/promises';
import { Temporal } from 'temporal-polyfill';
import type { RetryMethod } from './schema.ts';

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

export const MIN_JITTER = Temporal.Duration.from({
  seconds: 1,
});
export const MAX_JITTER = Temporal.Duration.from({
  seconds: 7,
});

export function calcExponentialBackoffAndJitter(
  minimumInterval: Temporal.Duration,
  attempts: number,
): Temporal.Duration {
  const jitterMilliseconds = getRandomInt(MIN_JITTER.total('milliseconds'), MAX_JITTER.total('milliseconds'));
  return Temporal.Duration.from({
    milliseconds: (minimumInterval.total('milliseconds') * (2 ** (attempts - 1))) + jitterMilliseconds,
  });
}

export function getInterval(
  method: RetryMethod,
  minimumInterval: Temporal.Duration,
  attempts: number,
): Temporal.Duration {
  switch (method) {
    case ('exponential_backoff'):
      return calcExponentialBackoffAndJitter(
        minimumInterval,
        attempts,
      );
    case ('equal_intervals'):
      return minimumInterval;
    default: {
      const _exhaustiveCheck: never = method;
      return minimumInterval;
    }
  }
}
