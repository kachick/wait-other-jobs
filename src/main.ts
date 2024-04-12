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
import { context } from '@actions/github';
import styles from 'ansi-styles';
const errorMessage = (body: string) => (`${styles.red.open}${body}${styles.red.close}`);
const succeededMessage = (body: string) => (`${styles.green.open}${body}${styles.green.close}`);
const colorize = (body: string, ok: boolean) => (ok ? succeededMessage(body) : errorMessage(body));

import { SkipFilterConditions, WaitFilterConditions, fetchOtherRunStatus } from './github-api.js';
import { readableDuration, wait, isRetryMethod, retryMethods, getIdleMilliseconds } from './wait.js';

async function run(): Promise<void> {
  startGroup('Parameters');
  const {
    repo: { repo, owner },
    payload,
    runId,
    runNumber,
    // Another file can set same workflow name. So you should filter workfrows from runId or the filename
    workflow,
    // On the otherhand, jobName should be unique in each workflow from YAML spec
    job,
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
        // Do not print secret even for debug code
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

  const waitSecondsBeforeFirstPolling = parseInt(
    getInput('wait-seconds-before-first-polling', { required: true, trimWhitespace: true }),
    10,
  );
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
  const waitList = WaitFilterConditions.parse(JSON.parse(getInput('wait-list', { required: true })));
  const skipList = SkipFilterConditions.parse(JSON.parse(getInput('skip-list', { required: true })));
  if (waitList.length > 0 && skipList.length > 0) {
    error('Do not specify both wait-list and skip-list');
    setFailed('Specified both list');
  }
  const isEarlyExit = getBooleanInput('early-exit', { required: true, trimWhitespace: true });
  const shouldSkipSameWorkflow = getBooleanInput('skip-same-workflow', { required: true, trimWhitespace: true });
  const isDryRun = getBooleanInput('dry-run', { required: true, trimWhitespace: true });

  info(JSON.stringify(
    {
      triggeredCommitSha: commitSha,
      runId,
      runNumber,
      workflow,
      job,
      repositoryInfo,
      waitSecondsBeforeFirstPolling,
      minIntervalSeconds,
      retryMethod,
      attemptLimits,
      isEarlyExit,
      isDryRun,
      waitList,
      skipList,
      shouldSkipSameWorkflow,
      // Of course, do NOT include tokens here.
    },
    null,
    2,
  ));

  // `getIDToken` does not fit for this purpose. It is provided for OIDC Token
  const githubToken = getInput('github-token', { required: true, trimWhitespace: false });
  setSecret(githubToken);

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

    if (attempts === 1) {
      const initialMsec = waitSecondsBeforeFirstPolling * 1000;
      info(`Wait ${readableDuration(initialMsec)} before first polling.`);
      await wait(initialMsec);
    } else {
      const msec = getIdleMilliseconds(retryMethod, minIntervalSeconds, attempts);
      info(`Wait ${readableDuration(msec)} before next polling to reduce API calls.`);
      await wait(msec);
    }

    startGroup(`Polling ${attempts}: ${(new Date()).toISOString()}`);

    const report = await fetchOtherRunStatus(
      githubToken,
      { ...repositoryInfo, ref: commitSha, runId, jobName: job },
      waitList,
      skipList,
      shouldSkipSameWorkflow,
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
