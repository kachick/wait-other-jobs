import {
  debug,
  info,
  getInput,
  getBooleanInput,
  setSecret,
  setFailed,
  isDebug,
  startGroup,
  endGroup,
  error,
} from '@actions/core';
import { getOctokit, context } from '@actions/github';

// eslint-disable-next-line import/no-unresolved
import { fetchJobIDs, fetchOtherRunStatus } from './github-api.js';
import {
  calculateIntervalMillisecondsAsExponentialBackoffAndJitter,
  readableDuration,
  wait,
  // eslint-disable-next-line import/no-unresolved
} from './wait.js';

async function run(): Promise<void> {
  startGroup('Setup variables');
  const {
    repo: { repo, owner },
    payload,
    runId,
    sha,
  } = context;
  const pr = payload.pull_request;
  let commitSha = sha;
  if (pr) {
    const { head: { sha: prSha = sha } } = pr;
    if (typeof prSha === 'string') {
      commitSha = prSha;
    } else {
      if (isDebug()) {
        debug(JSON.stringify(pr, null, 2));
      }
      error('github context has unexpected format: missing context.payload.pull_request.head.sha');
      setFailed('unexpected failure occurred');
      return;
    }
  }

  info(JSON.stringify({ triggeredCommitSha: commitSha, ownRunId: runId }, null, 2));

  const repositoryInfo = {
    owner,
    repo,
  } as const;

  const minIntervalSeconds = parseInt(
    getInput('min-interval-seconds', { required: true, trimWhitespace: true }),
    10,
  );
  const isEarlyExit = getBooleanInput('early-exit', { required: true, trimWhitespace: true });
  const isDryRun = getBooleanInput('dry-run', { required: true, trimWhitespace: true });

  const githubToken = getInput('github-token', { required: true, trimWhitespace: false });
  setSecret(githubToken);
  const octokit = getOctokit(githubToken);

  let attempts = 0;
  let shouldStop = false;

  endGroup();

  if (isDryRun) {
    return;
  }

  startGroup('Get own job_id');

  // eslint-disable-next-line camelcase
  const ownJobIDs = await fetchJobIDs(octokit, { ...repositoryInfo, run_id: runId });
  info(JSON.stringify({ ownJobIDs: [...ownJobIDs] }, null, 2));

  endGroup();

  for (;;) {
    attempts += 1;
    startGroup(`Polling times: ${attempts}`);

    const idleMilliseconds = calculateIntervalMillisecondsAsExponentialBackoffAndJitter(
      minIntervalSeconds,
      attempts,
    );
    info(`[estimation] It will wait ${readableDuration(idleMilliseconds)} to reduce api calling.`);
    await wait(idleMilliseconds);

    const report = await fetchOtherRunStatus(
      octokit,
      { ...repositoryInfo, ref: commitSha },
      ownJobIDs,
    );

    if (isDebug()) {
      debug(JSON.stringify(report, null, 2));
    }

    const { progress, conclusion } = report;

    switch (progress) {
      case 'in_progress': {
        if (conclusion === 'bad' && isEarlyExit) {
          shouldStop = true;
          setFailed('some jobs failed');
        }

        info('some jobs still in progress');
        break;
      }
      case 'done': {
        shouldStop = true;

        switch (conclusion) {
          case 'acceptable': {
            info('all jobs passed');
            break;
          }
          case 'bad': {
            setFailed('some jobs failed');
            break;
          }
          default: {
            const unexpectedConclusion: never = conclusion;
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            setFailed(`got unexpected conclusion: ${unexpectedConclusion}`);
            break;
          }
        }
        break;
      }
      default: {
        shouldStop = true;
        const unexpectedProgress: never = progress;
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        setFailed(`got unexpected progress: ${unexpectedProgress}`);
        break;
      }
    }

    endGroup();

    if (shouldStop) {
      break;
    }
  }
}

void run();
