import { debug, info, setFailed, isDebug, startGroup, endGroup } from '@actions/core';
import styles from 'ansi-styles';
const errorMessage = (body: string) => (`${styles.red.open}${body}${styles.red.close}`);
const succeededMessage = (body: string) => (`${styles.green.open}${body}${styles.green.close}`);
const colorize = (body: string, ok: boolean) => (ok ? succeededMessage(body) : errorMessage(body));

import { parseInput } from './input.ts';
import { fetchChecks } from './github-api.ts';
import { generateReport } from './report.ts';
import { readableDuration, wait, getIdleMilliseconds } from './wait.ts';

async function run(): Promise<void> {
  startGroup('Parameters');
  const { trigger, options, githubToken } = parseInput();
  info(JSON.stringify(
    {
      trigger,
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
      setFailed(errorMessage(`reached to given attempt limits "${options.attemptLimits}"`));
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

    startGroup(`Polling ${attempts}: ${(new Date()).toISOString()}`);
    const checks = await fetchChecks(githubToken, trigger);
    if (isDebug()) {
      debug(JSON.stringify(checks, null, 2));
    }
    const report = generateReport(
      checks,
      trigger,
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
        workflowPath,
        checkRunUrl,
        eventName,
      } = summary;
      const nullStr = '(null)';

      info(
        `${workflowPath}(${colorize(`${jobName}`, acceptable)}): [suiteStatus: ${checkSuiteStatus}][suiteConclusion: ${
          checkSuiteConclusion ?? nullStr
        }][runStatus: ${runStatus}][runConclusion: ${
          runConclusion ?? nullStr
        }][eventName: ${eventName}][runURL: ${checkRunUrl}]`,
      );
    }

    if (isDebug()) {
      debug(JSON.stringify(report, null, 2));
    }

    const { progress, conclusion } = report;

    switch (progress) {
      case 'in_progress': {
        if (conclusion === 'bad' && options.isEarlyExit) {
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
