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
import { Severity, generateReport, getSummaries, readableDuration } from './report.ts';
import { getInterval, wait } from './wait.ts';
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
      info(`Wait ${readableDuration(options.initialDuration)} before first polling.`);
      await wait(options.initialDuration);
    } else {
      const interval = getInterval(options.retryMethod, options.leastInterval, attempts);
      info(`Wait ${readableDuration(interval)} before next polling to reduce API calls.`);
      await wait(interval);
    }

    // Put getting elapsed time before of fetchChecks to keep accuracy of the purpose
    const elapsed = Temporal.Duration.from({ milliseconds: Math.ceil(performance.now() - startedAt) });
    startGroup(`Polling ${attempts}: ${(new Date()).toISOString()} # elapsed ${readableDuration(elapsed)})`);
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
        runStatus,
        runConclusion,
        jobName,
        workflowBasename,
        checkRunUrl,
        eventName,
        severity,
      } = summary;
      const nullStr = '(null)';

      info(
        `${workflowBasename}(${
          colorize(severity, jobName)
        }): [eventName: ${eventName}][runStatus: ${runStatus}][runConclusion: ${
          runConclusion ?? nullStr
        }][runURL: ${checkRunUrl}]`,
      );
    }

    if (isDebug()) {
      debug(JSON.stringify({ label: 'filtered', report }, null, 2));
    }

    const { ok, done, logs } = report;

    for (const { severity, message, resource } of logs) {
      info(colorize(severity, message));
      if ((severity != 'info') && resource) {
        info(JSON.stringify(resource, null, 2));
      }
    }

    if (done) {
      shouldStop = true;
    }
    if (!ok) {
      if (!done && !options.isEarlyExit) {
        info(
          colorize('warning', 'found bad conditions, but will continue rest pollings because of disabled early-exit'),
        );
      } else {
        shouldStop = true;
      }
    }

    endGroup();

    if (shouldStop) {
      if (ok) {
        info(colorize('notice', 'all jobs passed'));
      } else {
        setFailed(colorize('error', 'failed to wait for job success'));
      }

      break;
    }
  }
}

void run();
