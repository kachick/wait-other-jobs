import { wait, calcExponentialBackoffAndJitter, MIN_JITTER, MAX_JITTER, getInterval } from '../src/wait.ts';
import test from 'node:test';
import assert, { strictEqual } from 'node:assert';
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
  const minimumInterval = Temporal.Duration.from({ seconds: 100 });

  assert(
    Temporal.Duration.compare(
      calcExponentialBackoffAndJitter(minimumInterval, 1),
      MIN_JITTER.add({ milliseconds: 100000 }),
    ) >= 0,
  );
  strictEqual(
    Temporal.Duration.compare(
      calcExponentialBackoffAndJitter(minimumInterval, 1),
      MAX_JITTER.add({ milliseconds: 100000 }),
    ),
    -1,
  );

  assert(
    Temporal.Duration.compare(
      calcExponentialBackoffAndJitter(minimumInterval, 2),
      MIN_JITTER.add({ milliseconds: 200000 }),
    ) >= 0,
  );
  strictEqual(
    Temporal.Duration.compare(
      calcExponentialBackoffAndJitter(minimumInterval, 2),
      MAX_JITTER.add({ milliseconds: 200000 }),
    ),
    -1,
  );

  assert(
    Temporal.Duration.compare(
      calcExponentialBackoffAndJitter(minimumInterval, 3),
      MIN_JITTER.add({ milliseconds: 400000 }),
    ) >= 0,
  );
  strictEqual(
    Temporal.Duration.compare(
      calcExponentialBackoffAndJitter(minimumInterval, 3),
      MAX_JITTER.add({ milliseconds: 400000 }),
    ),
    -1,
  );

  assert(
    Temporal.Duration.compare(
      calcExponentialBackoffAndJitter(minimumInterval, 4),
      MIN_JITTER.add({ milliseconds: 800000 }),
    ) >= 0,
  );
  strictEqual(
    Temporal.Duration.compare(
      calcExponentialBackoffAndJitter(minimumInterval, 4),
      MAX_JITTER.add({ milliseconds: 800000 }),
    ),
    -1,
  );

  assert(
    Temporal.Duration.compare(
      calcExponentialBackoffAndJitter(minimumInterval, 5),
      MIN_JITTER.add({ milliseconds: 1600000 }),
    ) >= 0,
  );
  strictEqual(
    Temporal.Duration.compare(
      calcExponentialBackoffAndJitter(minimumInterval, 5),
      MAX_JITTER.add({ milliseconds: 1600000 }),
    ),
    -1,
  );
});

test('getInterval returns different value with the given method', () => {
  const minimumInterval = Temporal.Duration.from({ seconds: 100 });

  assert(
    Temporal.Duration.compare(
      getInterval('exponential_backoff', minimumInterval, 5),
      MIN_JITTER.add({ milliseconds: 1600000 }),
    ) >= 0,
  );
  strictEqual(
    Temporal.Duration.compare(
      getInterval('exponential_backoff', minimumInterval, 5),
      MAX_JITTER.add({ milliseconds: 1600000 }),
    ),
    -1,
  );

  strictEqual(
    Temporal.Duration.compare(
      getInterval('equal_intervals', minimumInterval, 5),
      minimumInterval,
    ),
    0,
  );
});
