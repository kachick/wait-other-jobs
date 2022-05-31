import {
  wait,
  calculateIntervalMillisecondsAsExponentialBackoffAndJitter,
  readableDuration,
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

  expect(
    calculateIntervalMillisecondsAsExponentialBackoffAndJitter(minIntervalSeconds, 1)
  ).toBeGreaterThanOrEqual(100000 + MIN_JITTER_MILLISECONDS);
  expect(
    calculateIntervalMillisecondsAsExponentialBackoffAndJitter(minIntervalSeconds, 1)
  ).toBeLessThan(100000 + MAX_JITTER_MILLISECONDS);
  expect(
    calculateIntervalMillisecondsAsExponentialBackoffAndJitter(minIntervalSeconds, 2)
  ).toBeGreaterThanOrEqual(200000 + MIN_JITTER_MILLISECONDS);
  expect(
    calculateIntervalMillisecondsAsExponentialBackoffAndJitter(minIntervalSeconds, 2)
  ).toBeLessThan(200000 + MAX_JITTER_MILLISECONDS);
  expect(
    calculateIntervalMillisecondsAsExponentialBackoffAndJitter(minIntervalSeconds, 3)
  ).toBeGreaterThanOrEqual(400000 + MIN_JITTER_MILLISECONDS);
  expect(
    calculateIntervalMillisecondsAsExponentialBackoffAndJitter(minIntervalSeconds, 3)
  ).toBeLessThan(400000 + MAX_JITTER_MILLISECONDS);
  expect(
    calculateIntervalMillisecondsAsExponentialBackoffAndJitter(minIntervalSeconds, 4)
  ).toBeGreaterThanOrEqual(800000 + MIN_JITTER_MILLISECONDS);
  expect(
    calculateIntervalMillisecondsAsExponentialBackoffAndJitter(minIntervalSeconds, 4)
  ).toBeLessThan(800000 + MAX_JITTER_MILLISECONDS);
  expect(
    calculateIntervalMillisecondsAsExponentialBackoffAndJitter(minIntervalSeconds, 5)
  ).toBeGreaterThanOrEqual(1600000 + MIN_JITTER_MILLISECONDS);
  expect(
    calculateIntervalMillisecondsAsExponentialBackoffAndJitter(minIntervalSeconds, 5)
  ).toBeLessThan(1600000 + MAX_JITTER_MILLISECONDS);
});

test('readableDuration', () => {
  expect(readableDuration(454356)).toBe('approximately 7.57 minutes');
});

// shows how the runner will run a javascript action with env / stdout protocol
test('runs', () => {
  env['INPUT_GITHUB-TOKEN'] = 'DUMMY_GITHUB_TOKEN-32191280-2027-45a4-b1c1-1050e0054bfc';
  env['INPUT_MIN-INTERVAL-SECONDS'] = '30';
  env['INPUT_DRY-RUN'] = 'true';
  env['INPUT_EARLY-EXIT'] = 'true';
  env['GITHUB_REPOSITORY'] = 'kachick/wait-other-jobs';
  env['GITHUB_RUN_ID'] = '2408217435';
  const np = execPath;
  const ip = join(__dirname, '..', 'lib', 'main.js');
  const options: ExecFileSyncOptions = {
    env,
  };
  const output = execFileSync(np, [ip], options).toString();
  expect(output).toMatch(/\b2408217435\b/);
  expect(output).toMatch(/::add-mask::DUMMY_GITHUB_TOKEN-32191280-2027-45a4-b1c1-1050e0054bfc/);
});
