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

function judge(summaries: readonly Summary[]): { done: boolean; ok: boolean; logs: Log[] } {
  const completed = summaries.filter((summary) => summary.runStatus === 'COMPLETED');
  const done = completed.length === summaries.length;
  const ok = completed.every((summary) => summary.acceptable);
  const logs: Log[] = [];

  if (!ok) {
    logs.push({
      severity: 'error',
      message: 'some jobs failed',
    });
  }

  if (!done) {
    logs.push({
      severity: 'info',
      message: 'some jobs still in progress',
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
  { waitList, skipList, shouldSkipSameWorkflow }: Pick<Options, 'waitList' | 'skipList' | 'shouldSkipSameWorkflow'>,
): Report {
  const others = summaries.filter((summary) => !(summary.isSameWorkflow && (trigger.jobName === summary.jobName)));
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
