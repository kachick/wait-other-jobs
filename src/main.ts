import { info, setFailed, startGroup, endGroup, setOutput } from '@actions/core';

import { parseInput } from './input.ts';
import { fetchChecks } from './github-api.ts';
import { PollingReport, colorize, generateReport, getSummaries, readableDuration, writeJobSummary } from './report.ts';
import { getInterval, wait } from './wait.ts';
import { Temporal } from 'temporal-polyfill';
import { Check, Options, Trigger } from './schema.ts';
import { join } from 'path';
import { writeFileSync } from 'fs';
import { env } from 'process';

interface PollingResult {
  elapsed: Temporal.Duration;
  checks: Check[];
  pollingReport: PollingReport;
}

// `payload` is intentionally omitted for now: https://github.com/kachick/wait-other-jobs/pull/832#discussion_r1625952633
interface Dumper {
  trigger: Trigger;
  options: Options;
  // - Do not include all pollings in one file, it might be large size
  results: Record<number, PollingResult>;
}

async function run(): Promise<void> {
  // Workaround for https://github.com/actions/runner/issues/241 and https://github.com/nodejs/node/pull/56722
  // Don't use `core.exportVariable`, we only use this ENV in this action.
  if (!('FORCE_COLOR' in env)) {
    env['FORCE_COLOR'] = 'true';
  }
  const startedAt = performance.now();
  startGroup('Parameters');
  const { trigger, options, githubToken, tempDir } = parseInput();
  const encodedParameters = JSON.stringify(
    // Do NOT include whole of payload
    {
      trigger,
      startedAt,
      options, // Do NOT include secrets
    },
    null,
    2,
  );
  info(encodedParameters);
  setOutput('parameters', encodedParameters);
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
      if (options.warmupDelay.sign > 0) {
        info(`Wait ${readableDuration(options.warmupDelay)} before first polling.`);
        await wait(options.warmupDelay);
      }
    } else {
      const interval = getInterval(options.retryMethod, options.minimumInterval, attempts);
      info(`Wait ${readableDuration(interval)} before next polling to reduce API calls.`);
      await wait(interval);
    }

    // Put getting elapsed time before of fetchChecks to keep accuracy of the purpose
    const elapsed = Temporal.Duration.from({ milliseconds: Math.ceil(performance.now() - startedAt) });
    startGroup(`Polling ${attempts}: ${(new Date()).toISOString()} # total elapsed ${readableDuration(elapsed)}`);
    const checks = await fetchChecks(options.apiUrl, githubToken, trigger);

    const pollingReport = generateReport(
      getSummaries(checks, trigger),
      trigger,
      elapsed,
      options,
    );

    if (attempts === 1) {
      dumper.results[attempts] = { elapsed, checks, pollingReport };
    }

    for (const pollingSummary of pollingReport.summaries) {
      info(pollingSummary.format());
    }

    const { ok, done, logs } = pollingReport;

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
        dumper.results[attempts] = { elapsed, checks, pollingReport };
      }

      if (ok) {
        info(colorize('notice', 'all jobs passed'));
      } else {
        setFailed(colorize('error', 'failed to wait for job success'));
      }

      writeJobSummary(pollingReport, options);

      break;
    }
  }

  writeFileSync(dumpFile, JSON.stringify(dumper, null, 2));
  setOutput('dump', dumpFile);
}

void run();
