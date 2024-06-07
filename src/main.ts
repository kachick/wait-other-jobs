import { info, setFailed, startGroup, endGroup, setOutput } from '@actions/core';
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
      const _exhaustiveCheck: never = severity;
      return message;
    }
  }
}

import { parseInput } from './input.ts';
import { fetchChecks } from './github-api.ts';
import { Report, Severity, generateReport, getSummaries, readableDuration } from './report.ts';
import { getInterval, wait } from './wait.ts';
import { Temporal } from 'temporal-polyfill';
import { Check, Options, Trigger } from './schema.ts';
import { join } from 'path';
import { writeFileSync } from 'fs';

interface Result {
  elapsed: Temporal.Duration;
  checks: Check[];
  report: Report;
}

// `payload` is intentionally omitted for now: https://github.com/kachick/wait-other-jobs/pull/832#discussion_r1625952633
interface Dumper {
  trigger: Trigger;
  options: Options;
  // - Do not include all pollings in one file, it might be large size
  results: Record<number, Result>;
}

async function run(): Promise<void> {
  const startedAt = performance.now();
  startGroup('Parameters');
  const { trigger, options, githubToken, tempDir } = parseInput();
  info(JSON.stringify(
    // Do NOT include payload
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

  // - Do not include secret even in debug mode
  const dumper: Dumper = { trigger, options, results: {} };
  const dumpFile = join(tempDir, 'dump.json');

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
    startGroup(`Polling ${attempts}: ${(new Date()).toISOString()} # total elapsed ${readableDuration(elapsed)}`);
    const checks = await fetchChecks(githubToken, trigger);

    const report = generateReport(
      getSummaries(checks, trigger),
      trigger,
      elapsed,
      options,
    );

    if (attempts === 1) {
      dumper.results[attempts] = { elapsed: elapsed, checks, report };
    }

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
      if (attempts !== 1) {
        dumper.results[attempts] = { elapsed, checks, report };
      }

      if (ok) {
        info(colorize('notice', 'all jobs passed'));
      } else {
        setFailed(colorize('error', 'failed to wait for job success'));
      }

      break;
    }
  }

  writeFileSync(dumpFile, JSON.stringify(dumper, null, 2));
  setOutput('dump', dumpFile);
}

void run();
