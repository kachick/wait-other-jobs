import { styleText } from 'node:util';
import { summary } from '@actions/core';
import type { CheckRun, CheckSuite, WorkflowRun } from '@octokit/graphql-schema';
import { join, relative } from 'path';
import { Temporal } from 'temporal-polyfill';
import type { Check, FilterCondition, Options, Trigger, WaitList } from './schema.ts';

interface Meta {
  color: Parameters<typeof styleText>[0] | null;
  emoji: string;
  level: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7; // https://datatracker.ietf.org/doc/html/rfc5424#section-6.2.1
}

// https://datatracker.ietf.org/doc/html/rfc5424#section-6.2.1
const severities = Object.freeze({
  error: Object.freeze({ color: 'red', emoji: '❌', level: 3 }),
  warning: Object.freeze({ color: 'yellow', emoji: '🤔', level: 4 }),
  notice: Object.freeze({ color: 'green', emoji: '✅', level: 5 }),
  info: Object.freeze({ color: null, emoji: '💬', level: 6 }),
}) satisfies { [key: string]: Meta };

export type Severity = keyof typeof severities;

export function colorize(severity: Severity, message: string): string {
  const color = severities[severity].color;

  if (color) {
    return styleText(color, message);
  }

  return message;
}

function getEmoji(severity: Severity): string {
  return severities[severity].emoji;
}

function compareLevel(a: Summary, b: Summary): number {
  return severities[a.severity].level - severities[b.severity].level;
}

export function readableDuration(duration: Temporal.Duration): string {
  const { hours, minutes, seconds } = duration.round({ largestUnit: 'hours' });
  const eachUnit = [`${seconds} seconds`];
  if (minutes > 0) {
    eachUnit.unshift(`${minutes} minutes`);
  }
  if (hours > 0) {
    eachUnit.unshift(`${hours} hours`);
  }
  return `about ${eachUnit.join(' ')}`;
}

export interface Summary {
  isAcceptable: boolean;
  isCompleted: boolean;
  severity: Severity;
  workflowPermalink: string;
  workflowBasename: string;
  isSameWorkflow: boolean;

  eventName: WorkflowRun['event'];

  checkSuiteStatus: CheckSuite['status'];
  checkSuiteConclusion: CheckSuite['conclusion'];

  runDatabaseId: CheckRun['databaseId'];
  jobName: CheckRun['name'];
  checkRunUrl: CheckRun['detailsUrl'];
  runStatus: CheckRun['status'];
  runConclusion: CheckRun['conclusion']; // null if status is in progress

  format: () => string;
}

function summarize(check: Check, trigger: Trigger): Summary {
  const { checkRun: run, checkSuite: suite, workflow, workflowRun } = check;
  const isCompleted = run.status === 'COMPLETED';
  const isAcceptable = (run.conclusion == 'SUCCESS')
    || (run.conclusion === 'SKIPPED')
    || (run.conclusion === 'NEUTRAL' && (suite.conclusion === 'SUCCESS' || suite.conclusion === 'SKIPPED'));

  return {
    isAcceptable,
    isCompleted,
    severity: isCompleted ? (isAcceptable ? 'notice' : 'error') : 'warning',
    workflowPermalink: workflowRun.event === 'dynamic' ? workflowRun.url : `${workflowRun.url}/workflow`, // workflow.url is not enough for permalink use
    workflowBasename: relative(`/${trigger.owner}/${trigger.repo}/actions/workflows/`, workflow.resourcePath),
    // Another file can set same workflow name. So you should filter workfrows from runId or the filename
    isSameWorkflow: suite.workflowRun?.databaseId === trigger.runId,

    eventName: workflowRun.event,

    checkSuiteStatus: suite.status,
    checkSuiteConclusion: suite.conclusion,

    runDatabaseId: run.databaseId,
    jobName: run.name,
    checkRunUrl: run.detailsUrl,
    runStatus: run.status,
    runConclusion: run.conclusion,

    format: function() {
      const nullStr = '(null)';

      return `${this.workflowBasename}(${
        colorize(this.severity, this.jobName)
      }): [eventName: ${this.eventName}][runStatus: ${this.runStatus}][runConclusion: ${
        this.runConclusion ?? nullStr
      }][runURL: ${this.checkRunUrl}]`;
    },
  };
}

export function getSummaries(checks: readonly Check[], trigger: Trigger): Summary[] {
  return checks.map((check) => summarize(check, trigger)).toSorted((a, b) =>
    join(a.workflowBasename, a.jobName).localeCompare(join(b.workflowBasename, b.jobName))
  );
}

interface Log {
  severity: Severity;
  message: string;
  resource?: Summary[] | WaitList;
}

export type PollingReport = {
  ok: boolean;
  done: boolean;
  logs: readonly Log[];
  summaries: readonly Summary[];
};

function matchPath(condition: FilterCondition, summary: Summary): boolean {
  const { workflowFile, jobMatchMode, ...restCondition } = condition;

  if (workflowFile !== summary.workflowBasename) {
    return false;
  }

  if (jobMatchMode === 'all') {
    return true;
  }

  if (!('jobName' in restCondition)) {
    throw new Error(`jobName is required when jobMatchMode is "${jobMatchMode}"`);
  }

  const jobName = restCondition.jobName;

  switch (jobMatchMode) {
    case 'exact': {
      return jobName === summary.jobName;
    }
    case 'prefix': {
      return summary.jobName.startsWith(jobName);
    }
    default: {
      const _exhaustiveCheck: never = jobMatchMode;
      throw new Error(`Unknown jobMatchMode is given: "${jobMatchMode}"`);
    }
  }
}

function seekWaitList(
  summaries: readonly Summary[],
  waitList: WaitList,
  elapsed: Temporal.Duration,
): { filtered: Summary[]; unmatches: WaitList; unstarted: WaitList } {
  const seeker = waitList.map((condition) => ({ ...condition, found: false }));
  const filtered = summaries.filter((summary) =>
    seeker.some((target) => {
      const isMatchPath = matchPath(target, summary);
      const isMatchEvent = target.eventName ? (target.eventName === summary.eventName) : true;
      if (isMatchPath && isMatchEvent) {
        target.found = true;
        return true;
      } else {
        return false;
      }
    })
  );

  const unmatches = seeker.filter((result) => (!(result.found)) && (!(result.optional)));
  const unstarted = unmatches.filter((result) => Temporal.Duration.compare(elapsed, result.startupGracePeriod) === -1);

  return { filtered, unmatches, unstarted };
}

function judge(summaries: readonly Summary[]): { done: boolean; ok: boolean; logs: Log[] } {
  const summariesByCompleted = Map.groupBy(summaries, (summary) => summary.isCompleted);
  const completed = summariesByCompleted.get(true) || [];
  const incompleted = summariesByCompleted.get(false) || [];
  const done = incompleted.length === 0;
  const failures = completed.filter((summary) => !summary.isAcceptable);
  const ok = failures.length === 0;
  const logs: Log[] = [];

  if (!ok) {
    logs.push({
      severity: 'error',
      message: 'some jobs failed',
      resource: failures,
    });
  }

  if (!done) {
    logs.push({
      severity: 'info',
      message: 'some jobs still in progress',
      resource: incompleted,
    });
  }

  return {
    done,
    ok,
    logs,
  };
}

export function generateReport(
  summaries: readonly Summary[],
  trigger: Trigger,
  elapsed: Temporal.Duration,
  { waitList, skipList, shouldSkipSameWorkflow }: Pick<
    Options,
    'waitList' | 'skipList' | 'shouldSkipSameWorkflow'
  >,
): PollingReport {
  const others = summaries.filter((summary) =>
    !(summary.isSameWorkflow && (
      // Ideally this logic should be...
      //
      // 1. `trigger(context).jobId === smmmary(checkRun).jobId`
      // But GitHub does not provide the jobId for each checkRun: https://github.com/orgs/community/discussions/8945
      //
      // or second place as
      // 2. `context.jobName === checkRun.jobName`
      // But GitHub does not provide the jobName for each context: https://github.com/orgs/community/discussions/16614
      //
      // On the otherhand, the context.jobId will be used for the default jobName
      // Anyway, in matrix use, GitHub uses the default name for the prefix. It should be considered in list based solutions
      trigger.jobId === summary.jobName
    ))
  );
  const targets = others.filter((summary) => !(summary.isSameWorkflow && shouldSkipSameWorkflow));

  if (waitList.length > 0) {
    const { filtered, unmatches, unstarted } = seekWaitList(targets, waitList, elapsed);
    const { ok, done, logs } = judge(filtered);
    const defaultReport = Object.freeze(
      {
        ok,
        done,
        summaries: filtered,
        logs,
      } satisfies PollingReport,
    );

    if (unstarted.length > 0) {
      return {
        ...defaultReport,
        done: false,
        logs: [...logs, {
          severity: 'warning',
          message: 'Some expected jobs were not started',
          resource: unstarted,
        }],
      };
    } else if (unmatches.length > 0) {
      return {
        ...defaultReport,
        ok: false,
        logs: [...logs, {
          severity: 'error',
          message: 'Failed to meet some runs on your specified wait-list',
          resource: unmatches,
        }],
      };
    }

    return defaultReport;
  }
  if (skipList.length > 0) {
    const filtered = targets.filter((summary) => !skipList.some((target) => matchPath(target, summary)));

    return { ...judge(filtered), summaries: filtered };
  }

  return { ...judge(targets), summaries: targets };
}

export function writeJobSummary(lastPolling: PollingReport, options: Options) {
  summary.addHeading('wait-other-jobs', 1);

  summary.addHeading('Conclusion', 2);

  if (lastPolling.ok) {
    summary.addRaw(`${getEmoji('notice')} All jobs passed`, true);
  } else {
    summary.addRaw(`${getEmoji('error')} Failed`, true);

    if (options.isEarlyExit) {
      summary.addHeading('Note', 3);
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
    ...(lastPolling.summaries.toSorted(compareLevel).map((
      { severity, workflowPermalink, workflowBasename, jobName, eventName, runStatus, runConclusion, checkRunUrl },
    ) => [{
      data: getEmoji(severity),
    }, {
      // e.g. AFAIK, we can't access and control github provided dependabot workflow except the run logs. The event type is `dynamic`.
      data: eventName === 'dynamic' ? workflowBasename : `<a href="${workflowPermalink}">${workflowBasename}</a>`,
    }, {
      data: jobName,
    }, {
      data: eventName,
    }, {
      data: runStatus,
    }, {
      data: runConclusion ?? '',
    }, {
      data: `<a href="${checkRunUrl}">Link</a>`, // Can't use []() style and there is no special option. See https://github.com/actions/toolkit/issues/1544
    }])),
  ]);

  summary.write();
}
