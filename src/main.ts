import { info, setFailed, startGroup, endGroup, setOutput, summary } from '@actions/core';

import { parseInput } from './input.ts';
import { fetchChecks } from './github-api.ts';
import {
  PollingReport,
  colorize,
  compareLevel,
  emoji,
  generateReport,
  getSummaries,
  readableDuration,
} from './report.ts';
import { getInterval, wait } from './wait.ts';
import { Temporal } from 'temporal-polyfill';
import { Check, Options, Trigger } from './schema.ts';
import { join } from 'path';
import { writeFileSync } from 'fs';

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
      if (options.initialDuration.sign > 0) {
        info(`Wait ${readableDuration(options.initialDuration)} before first polling.`);
        await wait(options.initialDuration);
      }
    } else {
      const interval = getInterval(options.retryMethod, options.leastInterval, attempts);
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

      summary.addHeading('wait-other-jobs', 1);

      summary.addHeading('Conclusion', 2);

      if (ok) {
        info(colorize('notice', 'all jobs passed'));
        summary.addRaw(`${emoji('notice')} All jobs passed`, true);
      } else {
        setFailed(colorize('error', 'failed to wait for job success'));
        summary.addRaw(`${emoji('error')} Failed`, true);

        if (options.isEarlyExit) {
          summary.addRaw(
            `This job was run with the early-exit mode enabled, so some targets might be shown in an incomplete state.`,
            true,
          );
        }
      }

      summary.addHeading('Details', 2);

      const headers = [
        { data: 'Severity', header: true },
        { data: 'Workflow', header: true },
        { data: 'Job', header: true },
        { data: 'Event', header: true },
        { data: 'Status', header: true },
        { data: 'Conclusion', header: true },
        { data: 'Log', header: true },
      ];

      summary.addTable([
        headers,
        ...(pollingReport.summaries.toSorted(compareLevel).map((polling) => [{
          data: emoji(polling.severity),
        }, {
          data: `<a href="${polling.workflowPermalink}">${polling.workflowBasename}</a>`,
        }, {
          data: polling.jobName,
        }, {
          data: polling.eventName,
        }, {
          data: polling.runStatus,
        }, {
          data: polling.runConclusion ?? '',
        }, {
          data: `<a href="${polling.checkRunUrl}">Link</a>`, // Can't use []() style and there is no special option. See https://github.com/actions/toolkit/issues/1544
        }])),
      ]);

      summary.write();

      break;
    }
  }

  writeFileSync(dumpFile, JSON.stringify(dumper, null, 2));
  setOutput('dump', dumpFile);
}

void run();
