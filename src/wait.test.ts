import {
  wait,
  calcExponentialBackoffAndJitter,
  MIN_JITTER_MILLISECONDS,
  MAX_JITTER_MILLISECONDS,
  getInterval,
} from './wait.ts';
import test from 'node:test';
import assert from 'node:assert';
import { Temporal } from 'temporal-polyfill';

test('wait 100 ms', async () => {
  performance.mark('start');
  await wait(Temporal.Duration.from({ milliseconds: 100 }));
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
  const leastInterval = Temporal.Duration.from({ seconds: 100 });

  assert(calcExponentialBackoffAndJitter(leastInterval, 1).total('milliseconds') >= (100000 + MIN_JITTER_MILLISECONDS));
  assert(calcExponentialBackoffAndJitter(leastInterval, 1).total('milliseconds') < (100000 + MAX_JITTER_MILLISECONDS));
  assert(calcExponentialBackoffAndJitter(leastInterval, 2).total('milliseconds') >= (200000 + MIN_JITTER_MILLISECONDS));
  assert(calcExponentialBackoffAndJitter(leastInterval, 2).total('milliseconds') < (200000 + MAX_JITTER_MILLISECONDS));
  assert(calcExponentialBackoffAndJitter(leastInterval, 3).total('milliseconds') >= (400000 + MIN_JITTER_MILLISECONDS));
  assert(calcExponentialBackoffAndJitter(leastInterval, 3).total('milliseconds') < (400000 + MAX_JITTER_MILLISECONDS));
  assert(calcExponentialBackoffAndJitter(leastInterval, 4).total('milliseconds') >= (800000 + MIN_JITTER_MILLISECONDS));
  assert(calcExponentialBackoffAndJitter(leastInterval, 4).total('milliseconds') < (800000 + MAX_JITTER_MILLISECONDS));
  assert(
    calcExponentialBackoffAndJitter(leastInterval, 5).total('milliseconds') >= (1600000 + MIN_JITTER_MILLISECONDS),
  );
  assert(calcExponentialBackoffAndJitter(leastInterval, 5).total('milliseconds') < (1600000 + MAX_JITTER_MILLISECONDS));
});

test('getInterval returns different value with the given method', () => {
  const leastInterval = Temporal.Duration.from({ seconds: 100 });

  assert(
    getInterval('exponential_backoff', leastInterval, 5).total('milliseconds') >= (1600000 + MIN_JITTER_MILLISECONDS),
  );
  assert(
    getInterval('exponential_backoff', leastInterval, 5).total('milliseconds') < (1600000 + MAX_JITTER_MILLISECONDS),
  );

  assert.strictEqual(
    Temporal.Duration.compare(getInterval('equal_intervals', leastInterval, 5), leastInterval),
    0,
  );
});
