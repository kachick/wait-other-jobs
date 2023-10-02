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
import styles from 'ansi-styles';
const errorMessage = (body: string) => (`${styles.red.open}${body}${styles.red.close}`);
const succeededMessage = (body: string) => (`${styles.green.open}${body}${styles.green.close}`);
const colorize = (body: string, ok: boolean) => (ok ? succeededMessage(body) : errorMessage(body));

import { fetchOtherRunStatus } from './github-api.js';
import { readableDuration, wait, isRetryMethod, retryMethods, getIdleMilliseconds } from './wait.js';

async function run(): Promise<void> {
  startGroup('Parameters');
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

  const repositoryInfo = {
    owner,
    repo,
  } as const;

  const minIntervalSeconds = parseInt(
    getInput('min-interval-seconds', { required: true, trimWhitespace: true }),
    10,
  );
  const retryMethod = getInput('retry-method', { required: true, trimWhitespace: true });
  if (!isRetryMethod(retryMethod)) {
    setFailed(
      `unknown parameter "${retryMethod}" is given. "retry-method" can take one of ${JSON.stringify(retryMethods)}`,
    );
    return;
  }
  const attemptLimits = parseInt(
    getInput('attempt-limits', { required: true, trimWhitespace: true }),
    10,
  );
  const isEarlyExit = getBooleanInput('early-exit', { required: true, trimWhitespace: true });
  const isDryRun = getBooleanInput('dry-run', { required: true, trimWhitespace: true });

  info(JSON.stringify(
    {
      triggeredCommitSha: commitSha,
      runId,
      repositoryInfo,
      minIntervalSeconds,
      retryMethod,
      attemptLimits,
      isEarlyExit,
      isDryRun,
      // Of course, do NOT include tokens here.
    },
    null,
    2,
  ));

  // `getIDToken` does not fit for this purpose. It is provided for OIDC Token
  const githubToken = getInput('github-token', { required: true, trimWhitespace: false });
  setSecret(githubToken);
  const octokit = getOctokit(githubToken);

  let attempts = 0;
  let shouldStop = false;

  endGroup();

  if (isDryRun) {
    return;
  }

  for (;;) {
    attempts += 1;
    if (attempts > attemptLimits) {
      setFailed(errorMessage(`reached to given attempt limits "${attemptLimits}"`));
      break;
    }
    const msec = getIdleMilliseconds(retryMethod, minIntervalSeconds, attempts);
    info(`Wait ${readableDuration(msec)} before next polling to reduce API calls.`);
    await wait(msec);
    startGroup(`Polling ${attempts}: ${(new Date()).toISOString()}`);

    const report = await fetchOtherRunStatus(
      octokit,
      { ...repositoryInfo, ref: commitSha, triggerRunId: runId },
    );

    for (const summary of report.summaries) {
      const {
        acceptable,
        checkSuiteStatus,
        checkSuiteConclusion,
        runStatus,
        runConclusion,
        jobName,
        workflowPath,
        checkRunUrl,
      } = summary;
      const nullStr = '(null)';

      info(
        `${workflowPath}(${colorize(`${jobName}`, acceptable)}): [suiteStatus: ${checkSuiteStatus}][suiteConclusion: ${
          checkSuiteConclusion ?? nullStr
        }][runStatus: ${runStatus}][runConclusion: ${runConclusion ?? nullStr}][runURL: ${checkRunUrl}]`,
      );
    }

    if (isDebug()) {
      debug(JSON.stringify(report, null, 2));
    }

    const { progress, conclusion } = report;

    switch (progress) {
      case 'in_progress': {
        if (conclusion === 'bad' && isEarlyExit) {
          shouldStop = true;
          setFailed(errorMessage('some jobs failed'));
        }

        info('some jobs still in progress');
        break;
      }
      case 'done': {
        shouldStop = true;

        switch (conclusion) {
          case 'acceptable': {
            info(succeededMessage('all jobs passed'));
            break;
          }
          case 'bad': {
            setFailed(errorMessage('some jobs failed'));
            break;
          }
          default: {
            const unexpectedConclusion: never = conclusion;
            setFailed(errorMessage(`got unexpected conclusion: ${unexpectedConclusion}`));
            break;
          }
        }
        break;
      }
      default: {
        shouldStop = true;
        const unexpectedProgress: never = progress;
        setFailed(errorMessage(`got unexpected progress: ${unexpectedProgress}`));
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
