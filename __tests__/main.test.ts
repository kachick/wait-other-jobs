import {
  wait,
  calculateIntervalMilliseconds,
  MIN_JITTER_MILLISECONDS,
  MAX_JITTER_MILLISECONDS,
} from '../src/wait';
import { env, execPath } from 'process';
import { execFileSync, ExecFileSyncOptions } from 'child_process';
import { join } from 'path';
import { expect, test } from '@jest/globals';

test('throws invalid number', async () => {
  const input = parseInt('foo', 10);
  await expect(wait(input)).rejects.toThrow('milliseconds not a number');
});

test('wait 500 ms', async () => {
  const start = new Date();
  await wait(500);
  const end = new Date();
  const delta = Math.abs(end.getTime() - start.getTime());
  expect(delta).toBeGreaterThan(450);
});

test('interval will be like a cheap exponential backoff', async () => {
  const minIntervalSeconds = 100;

  expect(calculateIntervalMilliseconds(minIntervalSeconds, 1)).toBeGreaterThanOrEqual(
    100000 + MIN_JITTER_MILLISECONDS
  );
  expect(calculateIntervalMilliseconds(minIntervalSeconds, 1)).toBeLessThan(
    100000 + MAX_JITTER_MILLISECONDS
  );
  expect(calculateIntervalMilliseconds(minIntervalSeconds, 2)).toBeGreaterThanOrEqual(
    200000 + MIN_JITTER_MILLISECONDS
  );
  expect(calculateIntervalMilliseconds(minIntervalSeconds, 2)).toBeLessThan(
    200000 + MAX_JITTER_MILLISECONDS
  );
  expect(calculateIntervalMilliseconds(minIntervalSeconds, 3)).toBeGreaterThanOrEqual(
    400000 + MIN_JITTER_MILLISECONDS
  );
  expect(calculateIntervalMilliseconds(minIntervalSeconds, 3)).toBeLessThan(
    400000 + MAX_JITTER_MILLISECONDS
  );
  expect(calculateIntervalMilliseconds(minIntervalSeconds, 4)).toBeGreaterThanOrEqual(
    800000 + MIN_JITTER_MILLISECONDS
  );
  expect(calculateIntervalMilliseconds(minIntervalSeconds, 4)).toBeLessThan(
    800000 + MAX_JITTER_MILLISECONDS
  );
  expect(calculateIntervalMilliseconds(minIntervalSeconds, 5)).toBeGreaterThanOrEqual(
    1600000 + MIN_JITTER_MILLISECONDS
  );
  expect(calculateIntervalMilliseconds(minIntervalSeconds, 5)).toBeLessThan(
    1600000 + MAX_JITTER_MILLISECONDS
  );
});

// shows how the runner will run a javascript action with env / stdout protocol
test('runs', () => {
  env['INPUT_GITHUB-TOKEN'] = 'dummy';
  env['INPUT_MIN-INTERVAL-SECONDS'] = '30';
  env['INPUT_DRY-RUN'] = 'true';
  env['GITHUB_REPOSITORY'] = 'kachick/wait-other-jobs';
  const np = execPath;
  const ip = join(__dirname, '..', 'lib', 'main.js');
  const options: ExecFileSyncOptions = {
    env,
  };
  const output = execFileSync(np, [ip], options).toString();
  expect(output).toBe('');
});
