import { CheckRun, CheckSuite, WorkflowRun } from '@octokit/graphql-schema';
import { Check, FilterCondition, Options, Trigger, WaitList } from './schema.ts';
import { join, relative } from 'path';
import { Temporal } from 'temporal-polyfill';
import { groupBy } from './util.ts';

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
  };
}

export function getSummaries(checks: readonly Check[], trigger: Trigger): Summary[] {
  return checks.map((check) => summarize(check, trigger)).toSorted((a, b) =>
    join(a.workflowBasename, a.jobName).localeCompare(join(b.workflowBasename, b.jobName))
  );
}

export type Severity = 'error' | 'warning' | 'notice' | 'info';

interface Log {
  severity: Severity;
  message: string;
  resource?: Summary[] | WaitList;
}

export type Report = {
  ok: boolean;
  done: boolean;
  logs: readonly Log[];
  summaries: readonly Summary[];
};

function matchPath({ workflowFile, jobName, jobMatchMode }: FilterCondition, summary: Summary): boolean {
  if (workflowFile !== summary.workflowBasename) {
    return false;
  }

  if (!jobName) {
    return true;
  }

  switch (jobMatchMode) {
    case 'exact': {
      return jobName === summary.jobName;
    }
    case 'prefix': {
      return summary.jobName.startsWith(jobName);
    }
    default: {
      const _exhaustiveCheck: never = jobMatchMode;
      return false;
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
  const summariesByCompleted = groupBy(summaries, (summary) => summary.isCompleted);
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
): Report {
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
      // On the otherhand, the conxtext.jobId will be used for the default jobName
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
      } satisfies Report,
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
