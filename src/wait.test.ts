import { performance } from 'node:perf_hooks';
import {
  wait,
  calcExponentialBackoffAndJitter,
  readableDuration,
  MIN_JITTER_MILLISECONDS,
  MAX_JITTER_MILLISECONDS,
  getIdleMilliseconds,
} from './wait.ts';
import test from 'node:test';
import assert from 'node:assert';

test('wait 100 ms', async () => {
  performance.mark('start');
  await wait(100);
  performance.mark('end');
  // The void typing looks like a wrong definition of @types/node
  const measure: unknown = performance.measure('Wait duration', 'start', 'end');
  // Also PerformanceMeasure looks not defined https://github.com/DefinitelyTyped/DefinitelyTyped/blame/be3a5a945efa53010eb2ed7fc35bcd46038909b0/types/node/v16/perf_hooks.d.ts
  if (!(measure && typeof measure === 'object' && 'duration' in measure && typeof measure.duration === 'number')) {
    throw Error('Performance API does incorrectly work');
  }
  assert(measure.duration >= 99);
  assert(measure.duration < 150);
});

test('interval will be like a cheap exponential backoff', () => {
  const minIntervalSeconds = 100;

  assert(calcExponentialBackoffAndJitter(minIntervalSeconds, 1) >= (100000 + MIN_JITTER_MILLISECONDS));
  assert(calcExponentialBackoffAndJitter(minIntervalSeconds, 1) < (100000 + MAX_JITTER_MILLISECONDS));
  assert(calcExponentialBackoffAndJitter(minIntervalSeconds, 2) >= (200000 + MIN_JITTER_MILLISECONDS));
  assert(calcExponentialBackoffAndJitter(minIntervalSeconds, 2) < (200000 + MAX_JITTER_MILLISECONDS));
  assert(calcExponentialBackoffAndJitter(minIntervalSeconds, 3) >= (400000 + MIN_JITTER_MILLISECONDS));
  assert(calcExponentialBackoffAndJitter(minIntervalSeconds, 3) < (400000 + MAX_JITTER_MILLISECONDS));
  assert(calcExponentialBackoffAndJitter(minIntervalSeconds, 4) >= (800000 + MIN_JITTER_MILLISECONDS));
  assert(calcExponentialBackoffAndJitter(minIntervalSeconds, 4) < (800000 + MAX_JITTER_MILLISECONDS));
  assert(calcExponentialBackoffAndJitter(minIntervalSeconds, 5) >= (1600000 + MIN_JITTER_MILLISECONDS));
  assert(calcExponentialBackoffAndJitter(minIntervalSeconds, 5) < (1600000 + MAX_JITTER_MILLISECONDS));
});

test('readableDuration', () => {
  assert.strictEqual(readableDuration(454356), 'about 7.6 minutes');
  assert.strictEqual(readableDuration(32100), 'about 32 seconds');
});

test('getIdleMilliseconds returns different value with the given method', () => {
  const minIntervalSeconds = 100;

  assert(getIdleMilliseconds('exponential_backoff', minIntervalSeconds, 5) >= (1600000 + MIN_JITTER_MILLISECONDS));
  assert(getIdleMilliseconds('exponential_backoff', minIntervalSeconds, 5) < (1600000 + MAX_JITTER_MILLISECONDS));

  assert.strictEqual(getIdleMilliseconds('equal_intervals', minIntervalSeconds, 5), minIntervalSeconds * 1000);
});
