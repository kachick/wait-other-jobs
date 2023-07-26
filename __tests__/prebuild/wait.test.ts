import { performance } from 'node:perf_hooks';
import {
  wait,
  calcExponentialBackoffAndJitter,
  readableDuration,
  MIN_JITTER_MILLISECONDS,
  MAX_JITTER_MILLISECONDS,
  getIdleMilliseconds,
} from '../../src/wait';
import { expect, test } from '@jest/globals';

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
  expect(measure.duration).toBeGreaterThanOrEqual(99);
  expect(measure.duration).toBeLessThan(150);
});

test('interval will be like a cheap exponential backoff', () => {
  const minIntervalSeconds = 100;

  expect(
    calcExponentialBackoffAndJitter(minIntervalSeconds, 1),
  ).toBeGreaterThanOrEqual(100000 + MIN_JITTER_MILLISECONDS);
  expect(
    calcExponentialBackoffAndJitter(minIntervalSeconds, 1),
  ).toBeLessThan(100000 + MAX_JITTER_MILLISECONDS);
  expect(
    calcExponentialBackoffAndJitter(minIntervalSeconds, 2),
  ).toBeGreaterThanOrEqual(200000 + MIN_JITTER_MILLISECONDS);
  expect(
    calcExponentialBackoffAndJitter(minIntervalSeconds, 2),
  ).toBeLessThan(200000 + MAX_JITTER_MILLISECONDS);
  expect(
    calcExponentialBackoffAndJitter(minIntervalSeconds, 3),
  ).toBeGreaterThanOrEqual(400000 + MIN_JITTER_MILLISECONDS);
  expect(
    calcExponentialBackoffAndJitter(minIntervalSeconds, 3),
  ).toBeLessThan(400000 + MAX_JITTER_MILLISECONDS);
  expect(
    calcExponentialBackoffAndJitter(minIntervalSeconds, 4),
  ).toBeGreaterThanOrEqual(800000 + MIN_JITTER_MILLISECONDS);
  expect(
    calcExponentialBackoffAndJitter(minIntervalSeconds, 4),
  ).toBeLessThan(800000 + MAX_JITTER_MILLISECONDS);
  expect(
    calcExponentialBackoffAndJitter(minIntervalSeconds, 5),
  ).toBeGreaterThanOrEqual(1600000 + MIN_JITTER_MILLISECONDS);
  expect(
    calcExponentialBackoffAndJitter(minIntervalSeconds, 5),
  ).toBeLessThan(1600000 + MAX_JITTER_MILLISECONDS);
});

test('readableDuration', () => {
  expect(readableDuration(454356)).toBe('about 7.6 minutes');
  expect(readableDuration(32100)).toBe('about 32 seconds');
});

test('getIdleMilliseconds returns different value with the given method', () => {
  const minIntervalSeconds = 100;

  expect(
    getIdleMilliseconds('exponential_backoff', minIntervalSeconds, 5),
  ).toBeGreaterThanOrEqual(1600000 + MIN_JITTER_MILLISECONDS);
  expect(
    getIdleMilliseconds('exponential_backoff', minIntervalSeconds, 5),
  ).toBeLessThan(1600000 + MAX_JITTER_MILLISECONDS);

  expect(
    getIdleMilliseconds('equal_intervals', minIntervalSeconds, 5),
  ).toBe(minIntervalSeconds * 1000);
});
