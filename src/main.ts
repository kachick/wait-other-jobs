import { debug, info, getInput } from '@actions/core';
import { getOctokit, context } from '@actions/github';

// eslint-disable-next-line import/no-unresolved
import { getJobIDs, getOtherRunsStatus, OtherRunsStatus } from './github-api.js';
// eslint-disable-next-line import/no-unresolved
import { calculateIntervalMilliseconds, wait } from './wait.js';

async function run(): Promise<void> {
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
      debug(JSON.stringify(pr, null, 2));
      throw Error(
        'github context has unexpected format: missing context.payload.pull_request.head.sha'
      );
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
  const isDryRun =
    getInput('dry-run', { required: true, trimWhitespace: true }).toLowerCase() === 'true';

  const githubToken = getInput('github-token', { required: true, trimWhitespace: false });
  const octokit = getOctokit(githubToken);

  let attempts = 0;
  let shouldStop = false;
  let otherRunsStatus: OtherRunsStatus = 'in_progress';
  let existFailures = false;

  if (isDryRun) {
    return;
  }

  // eslint-disable-next-line camelcase
  const ownJobIDs = await getJobIDs(octokit, { ...repositoryInfo, run_id: runId });
  info(JSON.stringify({ ownJobIDs: [...ownJobIDs] }, null, 2));

  for (;;) {
    attempts += 1;
    // "Exponential backoff and jitter"
    await wait(calculateIntervalMilliseconds(minIntervalSeconds, attempts));
    otherRunsStatus = await getOtherRunsStatus(
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
        existFailures = true;
        info('some jobs failed');
        break;
      }
      case 'in_progress': {
        info(`some jobs still in progress: ${attempts} times checked`);
        break;
      }
      default: {
        shouldStop = true;
        const unexpectedStatus: never = otherRunsStatus;
        info(`got unexpected status: ${unexpectedStatus}`);
      }
    }

    if (shouldStop) {
      break;
    }
  }

  if (existFailures) {
    // https://github.com/openbsd/src/blob/2bcc3feb777e607cc7bedb460a2f5e5ff5cb1c50/include/sysexits.h#L99
    process.exit(64);
  }
}

run();
