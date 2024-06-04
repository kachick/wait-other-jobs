import { getInput, getBooleanInput, setSecret, error } from '@actions/core';
import { WebhookPayload } from '@actions/github/lib/interfaces.ts';
import { context } from '@actions/github';

import { Durationable, Options, Trigger } from './schema.ts';

export function parseInput(): { trigger: Trigger; options: Options; githubToken: string; payload: WebhookPayload } {
  const {
    repo,
    payload,
    runId,
    job,
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

  const waitSecondsBeforeFirstPolling = parseInt(
    getInput('wait-seconds-before-first-polling', { required: true, trimWhitespace: true }),
    10,
  );
  const minIntervalSeconds = parseInt(
    getInput('min-interval-seconds', { required: true, trimWhitespace: true }),
    10,
  );
  const retryMethod = getInput('retry-method', { required: true, trimWhitespace: true });
  const attemptLimits = parseInt(
    getInput('attempt-limits', { required: true, trimWhitespace: true }),
    10,
  );
  const isEarlyExit = getBooleanInput('early-exit', { required: true, trimWhitespace: true });
  const shouldSkipSameWorkflow = getBooleanInput('skip-same-workflow', { required: true, trimWhitespace: true });
  const shouldDump = getBooleanInput('dump', { required: true, trimWhitespace: true });
  const isDryRun = getBooleanInput('dry-run', { required: true, trimWhitespace: true });

  const options = Options.parse({
    initialDuration: Durationable.parse({ seconds: waitSecondsBeforeFirstPolling }),
    leastInterval: Durationable.parse({ seconds: minIntervalSeconds }),
    retryMethod,
    attemptLimits,
    waitList: JSON.parse(getInput('wait-list', { required: true })),
    skipList: JSON.parse(getInput('skip-list', { required: true })),
    isEarlyExit,
    shouldSkipSameWorkflow,
    shouldDump,
    isDryRun,
  });

  const trigger = { ...repo, ref: commitSha, runId, jobName: job, eventName } as const satisfies Trigger;

  // `getIDToken` does not fit for this purpose. It is provided for OIDC Token
  const githubToken = getInput('github-token', { required: true, trimWhitespace: false });
  setSecret(githubToken);

  return { trigger, options, githubToken, payload };
}
