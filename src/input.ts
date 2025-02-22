import { getInput, getBooleanInput, setSecret, error } from '@actions/core';
import { context } from '@actions/github';

import { Durationable, jsonInput, Options, Path, Trigger } from './schema.ts';
import { env } from 'node:process';
import { mkdtempSync } from 'fs';
import { join } from 'path';

export function parseInput(): { trigger: Trigger; options: Options; githubToken: string; tempDir: string } {
  const {
    repo,
    payload,
    runId,
    // Not jobName, and GitHub does not provide the jobName
    // https://github.com/orgs/community/discussions/8945
    // https://github.com/orgs/community/discussions/16614
    job: jobId,
    sha,
    eventName,
  } = context;
  const pr = payload.pull_request;
  let commitSha = sha;
  if (pr) {
    const { head: { sha: prSha = sha } } = pr;
    if (typeof prSha === 'string') {
      commitSha = prSha;
    } else {
      error('github context has unexpected format: missing context.payload.pull_request.head.sha');
    }
  }
  // Do not use `tmpdir` from `node:os` in action: See https://github.com/actions/toolkit/issues/518
  const tempRoot = Path.parse(env['RUNNER_TEMP']);
  const tempDir = mkdtempSync(join(tempRoot, 'wait-other-jobs-'));

  const waitSecondsBeforeFirstPolling = getInput('wait-seconds-before-first-polling', {
    required: false,
    trimWhitespace: true,
  });
  const warmupDelay = waitSecondsBeforeFirstPolling
    ? Durationable.parse({ seconds: parseInt(waitSecondsBeforeFirstPolling, 10) })
    : Durationable.parse(getInput('warmup-delay', { required: true, trimWhitespace: true }));

  const minIntervalSeconds = getInput('min-interval-seconds', {
    required: false,
    trimWhitespace: true,
  });
  const minimumInterval = minIntervalSeconds
    ? Durationable.parse({ seconds: parseInt(minIntervalSeconds, 10) })
    : Durationable.parse(getInput('minimum-interval', { required: true, trimWhitespace: true }));

  const retryMethod = getInput('retry-method', { required: true, trimWhitespace: true });
  const attemptLimits = parseInt(
    getInput('attempt-limits', { required: true, trimWhitespace: true }),
    10,
  );
  const isEarlyExit = getBooleanInput('early-exit', { required: true, trimWhitespace: true });
  const shouldSkipSameWorkflow = getBooleanInput('skip-same-workflow', { required: true, trimWhitespace: true });
  const isDryRun = getBooleanInput('dry-run', { required: true, trimWhitespace: true });
  const apiUrl = getInput('github-api-url', { required: true, trimWhitespace: true });

  const options = Options.parse({
    apiUrl,
    warmupDelay,
    minimumInterval,
    retryMethod,
    attemptLimits,
    waitList: jsonInput.parse(getInput('wait-list', { required: true })),
    skipList: jsonInput.parse(getInput('skip-list', { required: true })),
    isEarlyExit,
    shouldSkipSameWorkflow,
    isDryRun,
  });

  const trigger = { ...repo, ref: commitSha, runId, jobId, eventName } as const satisfies Trigger;

  // `getIDToken` does not fit for this purpose. It is provided for OIDC Token
  const githubToken = getInput('github-token', { required: true, trimWhitespace: false });
  setSecret(githubToken);

  return { trigger, options, githubToken, tempDir };
}
