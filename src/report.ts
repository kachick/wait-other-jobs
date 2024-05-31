import { CheckRun, CheckSuite, WorkflowRun } from '@octokit/graphql-schema';
import { Check, Options, Trigger, WaitList, getDuration } from './schema.ts';
import { join, relative } from 'path';
import { Temporal } from 'temporal-polyfill';

export interface Summary {
  acceptable: boolean;
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
  return {
    acceptable: run.conclusion == 'SUCCESS' || run.conclusion === 'SKIPPED'
      || (run.conclusion === 'NEUTRAL'
        && (suite.conclusion === 'SUCCESS' || suite.conclusion === 'SKIPPED')),
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

interface Acceptable {
  conclusion: 'acceptable';
}

interface Bad {
  conclusion: 'bad';
}

export type Severity = 'error' | 'warning' | 'notice' | 'info';

interface Log {
  severity: Severity;
  message: string;
  resource?: Summary[] | WaitList;
}

export type Report = (Acceptable | Bad) & {
  progress: 'in_progress' | 'done';
  logs: readonly Log[];
  summaries: readonly Summary[];
};

function seekWaitList(
  summaries: readonly Summary[],
  waitList: WaitList,
  elapsed: Temporal.Duration,
): { filtered: Summary[]; unmatches: WaitList; unstarted: WaitList } {
  const seeker = waitList.map((condition) => ({ ...condition, found: false }));
  const filtered = summaries.filter((summary) =>
    seeker.some((target) => {
      const isMatchPath = target.workflowFile === summary.workflowBasename
        && (target.jobName ? (target.jobName === summary.jobName) : true);
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
  const unstarted = unmatches.filter((result) =>
    Temporal.Duration.compare(elapsed, getDuration(result.startupGracePeriod)) === -1
  );

  return { filtered, unmatches, unstarted };
}

function judge(targets: readonly Summary[]): Pick<Report, 'progress' | 'conclusion'> & { logs: Log[] } {
  const completed = targets.filter((summary) => summary.runStatus === 'COMPLETED');
  const progress: Report['progress'] = completed.length === targets.length
    ? 'done'
    : 'in_progress';
  const conclusion: Report['conclusion'] = completed.every((summary) => summary.acceptable)
    ? 'acceptable'
    : 'bad';
  const logs: Log[] = [];

  if (conclusion === 'bad') {
    logs.push({
      severity: 'error',
      message: 'some jobs failed',
    });
  }

  if (progress === 'in_progress') {
    logs.push({
      severity: 'info',
      message: 'some jobs still in progress',
    });
  } else {
    if (conclusion === 'acceptable') {
      logs.push({
        severity: 'notice',
        message: 'all jobs passed',
      });
    }
  }

  return {
    progress,
    conclusion,
    logs,
  };
}

export function generateReport(
  summaries: readonly Summary[],
  trigger: Trigger,
  elapsed: Temporal.Duration,
  { waitList, skipList, shouldSkipSameWorkflow }: Pick<Options, 'waitList' | 'skipList' | 'shouldSkipSameWorkflow'>,
): Report {
  const others = summaries.filter((summary) => !(summary.isSameWorkflow && (trigger.jobName === summary.jobName)));
  const targets = others.filter((summary) => !(summary.isSameWorkflow && shouldSkipSameWorkflow));

  if (waitList.length > 0) {
    const { filtered, unmatches, unstarted } = seekWaitList(targets, waitList, elapsed);
    let { conclusion, progress, logs } = judge(filtered);
    logs = [...logs];

    if (unstarted.length > 0) {
      progress = 'in_progress';
      logs.push({
        severity: 'warning',
        message: 'Some expected jobs were not started',
        resource: unstarted,
      });
    } else if (unmatches.length > 0) {
      conclusion = 'bad';
      logs.push({
        severity: 'error',
        message: 'Failed to meet some runs on your specified wait-list',
        resource: unmatches,
      });
    }

    return { conclusion, progress, summaries: filtered, logs };
  }
  if (skipList.length > 0) {
    const filtered = targets.filter((summary) =>
      !skipList.some((target) =>
        target.workflowFile === summary.workflowBasename
        && (target.jobName ? (target.jobName === summary.jobName) : true)
      )
    );

    return { ...judge(filtered), summaries: filtered };
  }

  return { ...judge(targets), summaries: targets };
}
