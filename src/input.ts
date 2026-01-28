import { mkdtempSync } from 'node:fs';
import { join } from 'node:path';
import { env } from 'node:process';
import { error, getBooleanInput, getInput, setSecret } from '@actions/core';
import { context } from '@actions/github';
import { ConfigOptions, Durationable, jsonInput, Path, RuntimeOptions, type Trigger } from './schema.ts';

export function resolveRuntimeOptions(configOptions: ConfigOptions): RuntimeOptions {
  const { eventNames: globalEventNames, waitList: waitListConfig, skipList: skipListConfig } = configOptions;

  return RuntimeOptions.parse({
    ...configOptions,
    waitList: waitListConfig.map((item) => ({
      ...item,
      eventNames: item.eventNames ?? globalEventNames,
    })),
    skipList: skipListConfig.map((item) => ({
      ...item,
      eventNames: item.eventNames ?? globalEventNames,
    })),
  });
}

export function parseInput(): { trigger: Trigger; options: RuntimeOptions; githubToken: string; tempDir: string } {
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
  // biome-ignore lint/complexity/useLiteralKeys: https://github.com/biomejs/biome/issues/463
  const tempRoot = Path.parse(env['RUNNER_TEMP']);
  const tempDir = mkdtempSync(join(tempRoot, 'wait-other-jobs-'));

  const warmupDelay = Durationable.parse(getInput('warmup-delay', { required: true, trimWhitespace: true }));

  const minimumInterval = Durationable.parse(getInput('minimum-interval', { required: true, trimWhitespace: true }));

  const retryMethod = getInput('retry-method', { required: true, trimWhitespace: true });
  const attemptLimits = parseInt(
    getInput('attempt-limits', { required: true, trimWhitespace: true }),
    10,
  );
  const isEarlyExitEnabled = getBooleanInput('early-exit', { required: true, trimWhitespace: true });
  const isSkipSameWorkflowEnabled = getBooleanInput('skip-same-workflow', { required: true, trimWhitespace: true });
  const isDryRunEnabled = getBooleanInput('dry-run', { required: true, trimWhitespace: true });
  const apiUrl = getInput('github-api-url', { required: true, trimWhitespace: true });

  const configOptions = ConfigOptions.parse({
    apiUrl,
    warmupDelay,
    minimumInterval,
    retryMethod,
    attemptLimits,
    waitList: jsonInput.parse(getInput('wait-list', { required: true })),
    skipList: jsonInput.parse(getInput('skip-list', { required: true })),
    eventNames: jsonInput.parse(getInput('event-list', { required: true })),
    isEarlyExitEnabled,
    isSkipSameWorkflowEnabled,
    isDryRunEnabled,
  });

  const runtimeOptions = resolveRuntimeOptions(configOptions);

  const trigger = { ...repo, ref: commitSha, runId, jobId, eventName } as const satisfies Trigger;

  // `getIDToken` does not fit for this purpose. It is provided for OIDC Token
  const githubToken = getInput('github-token', { required: true, trimWhitespace: false });
  setSecret(githubToken);

  return { trigger, options: runtimeOptions, githubToken, tempDir };
}
