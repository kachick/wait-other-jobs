import { debug, info, setFailed, isDebug, startGroup, endGroup } from '@actions/core';
import styles from 'ansi-styles';

function colorize(severity: Severity, message: string): string {
  switch (severity) {
    case 'error': {
      return `${styles.red.open}${message}${styles.red.close}`;
    }
    case 'warning': {
      return `${styles.yellow.open}${message}${styles.yellow.close}`;
    }
    case 'notice': {
      return `${styles.green.open}${message}${styles.green.close}`;
    }
    case 'info': {
      return message;
    }
    default: {
      const _unexpectedSeverity: never = severity;
      return message;
    }
  }
}

import { parseInput } from './input.ts';
import { fetchChecks } from './github-api.ts';
import { Severity, generateReport, getSummaries } from './report.ts';
import { readableDuration, wait, getIdleMilliseconds } from './wait.ts';
import { Temporal } from 'temporal-polyfill';

async function run(): Promise<void> {
  const startedAt = performance.now();
  startGroup('Parameters');
  const { trigger, options, githubToken } = parseInput();
  info(JSON.stringify(
    {
      trigger,
      startedAt,
      options, // Do NOT include secrets
    },
    null,
    2,
  ));
  endGroup();

  let attempts = 0;
  let shouldStop = false;

  if (options.isDryRun) {
    return;
  }

  for (;;) {
    attempts += 1;
    if (attempts > options.attemptLimits) {
      setFailed(colorize('error', `reached to given attempt limits "${options.attemptLimits}"`));
      break;
    }

    if (attempts === 1) {
      const initialMsec = options.waitSecondsBeforeFirstPolling * 1000;
      info(`Wait ${readableDuration(initialMsec)} before first polling.`);
      await wait(initialMsec);
    } else {
      const msec = getIdleMilliseconds(options.retryMethod, options.minIntervalSeconds, attempts);
      info(`Wait ${readableDuration(msec)} before next polling to reduce API calls.`);
      await wait(msec);
    }

    // Put getting elapsed time before of fetchChecks to keep accuracy of the purpose
    const elapsed = Temporal.Duration.from({ milliseconds: Math.ceil(performance.now() - startedAt) });
    startGroup(`Polling ${attempts}: ${(new Date()).toISOString()} => ${elapsed.toString()}`);
    const checks = await fetchChecks(githubToken, trigger);
    if (isDebug()) {
      debug(JSON.stringify({ label: 'rawdata', checks, elapsed }, null, 2));
    }
    const report = generateReport(
      getSummaries(checks, trigger),
      trigger,
      elapsed,
      options,
    );

    for (const summary of report.summaries) {
      const {
        acceptable,
        checkSuiteStatus,
        checkSuiteConclusion,
        runStatus,
        runConclusion,
        jobName,
        workflowBasename,
        checkRunUrl,
        eventName,
      } = summary;
      const nullStr = '(null)';

      info(
        `${workflowBasename}(${
          colorize(acceptable ? 'notice' : 'error', `${jobName}`)
        }): [suiteStatus: ${checkSuiteStatus}][suiteConclusion: ${
          checkSuiteConclusion ?? nullStr
        }][runStatus: ${runStatus}][runConclusion: ${
          runConclusion ?? nullStr
        }][eventName: ${eventName}][runURL: ${checkRunUrl}]`,
      );
    }

    if (isDebug()) {
      debug(JSON.stringify({ label: 'filtered', report }, null, 2));
    }

    const { progress, conclusion, logs } = report;

    for (const { severity, message, resource } of logs) {
      info(colorize(severity, [message, resource ?? JSON.stringify(resource, null, 2)].join('\n')));
    }

    if (progress === 'done') {
      shouldStop = true;
    }

    if (conclusion !== 'acceptable') {
      shouldStop = true;
      setFailed(colorize('error', 'failed to wait for success'));
    }

    endGroup();

    if (shouldStop) {
      break;
    }
  }
}

void run();
