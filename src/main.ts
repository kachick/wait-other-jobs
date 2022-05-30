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
import { getJobIDs, getOtherRunsStatus } from './github-api.js';
// eslint-disable-next-line import/no-unresolved
import { calculateIntervalMilliseconds, wait } from './wait.js';

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
  if (pr && 'head' in pr) {
    const { head } = pr;
    if (typeof head === 'object' && 'sha' in head) {
      commitSha = head.sha;
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
  };

  const minIntervalSeconds = parseInt(
    getInput('min-interval-seconds', { required: true, trimWhitespace: true }),
    10
  );
  const isDryRun = getBooleanInput('dry-run', { required: true, trimWhitespace: true });

  const githubToken = getInput('github-token', { required: true, trimWhitespace: false });
  setSecret(githubToken);
  const octokit = getOctokit(githubToken);

  let attempts = 0;
  let shouldStop = false;
  // let otherRunsStatus: OtherRunsStatus = 'in_progress';

  endGroup();

  if (isDryRun) {
    return;
  }

  startGroup('Get own job_id');

  // eslint-disable-next-line camelcase
  const ownJobIDs = await getJobIDs(octokit, { ...repositoryInfo, run_id: runId });
  info(JSON.stringify({ ownJobIDs: [...ownJobIDs] }, null, 2));

  endGroup();

  for (;;) {
    attempts += 1;
    startGroup(`Polling times: ${attempts}`);
    // "Exponential backoff and jitter"
    await wait(calculateIntervalMilliseconds(minIntervalSeconds, attempts));
    const otherRunsStatus = await getOtherRunsStatus(
      octokit,
      { ...repositoryInfo, ref: commitSha },
      ownJobIDs
    );
    switch (otherRunsStatus) {
      case 'succeeded': {
        shouldStop = true;
        info('all jobs passed');
        break;
      }
      case 'failed': {
        shouldStop = true;
        setFailed('some jobs failed');
        break;
      }
      case 'in_progress': {
        info('some jobs still in progress');
        break;
      }
      default: {
        shouldStop = true;
        const unexpectedStatus: never = otherRunsStatus;
        info(`got unexpected status: ${unexpectedStatus}`);
      }
    }
    endGroup();

    if (shouldStop) {
      break;
    }
  }
}

run();
