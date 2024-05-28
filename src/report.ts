import { CheckRun, CheckSuite, WorkflowRun } from '@octokit/graphql-schema';
import { Check, Options, Trigger } from './schema.ts';
import { join, relative } from 'path';

interface Summary {
  acceptable: boolean;
  workflowPath: string;
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

export interface Report {
  progress: 'in_progress' | 'done';
  conclusion: 'acceptable' | 'bad';
  summaries: Summary[];
}

function summarize(check: Check, trigger: Trigger): Summary {
  const { checkRun: run, checkSuite: suite, workflow, workflowRun } = check;
  return {
    acceptable: run.conclusion == 'SUCCESS' || run.conclusion === 'SKIPPED'
      || (run.conclusion === 'NEUTRAL'
        && (suite.conclusion === 'SUCCESS' || suite.conclusion === 'SKIPPED')),
    workflowPath: relative(`/${trigger.owner}/${trigger.repo}/actions/workflows/`, workflow.resourcePath),
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

export function generateReport(
  checks: readonly Check[],
  trigger: Trigger,
  elapsedMsec: number,
  { waitList, skipList, shouldSkipSameWorkflow }: Pick<Options, 'waitList' | 'skipList' | 'shouldSkipSameWorkflow'>,
): Report {
  const summaries = checks.map((check) => summarize(check, trigger)).toSorted((a, b) =>
    join(a.workflowPath, a.jobName).localeCompare(join(b.workflowPath, b.jobName))
  );

  const others = summaries.filter((summary) => !(summary.isSameWorkflow && (trigger.jobName === summary.jobName)));
  let filtered = others.filter((summary) => !(summary.isSameWorkflow && shouldSkipSameWorkflow));

  if (waitList.length > 0) {
    const seeker = waitList.map((condition) => ({ ...condition, found: false }));
    filtered = filtered.filter((summary) =>
      seeker.some((target) => {
        const isMatchPath = target.workflowFile === summary.workflowPath
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

    const unmatches = seeker.filter((result) =>
      (!(result.found)) && (!(result.optional)) && (result.marginOfStartingSeconds * 1000 < elapsedMsec)
    );

    if (unmatches.length > 0) {
      throw new Error(`Failed to meet some runs on your specified wait-list: ${JSON.stringify(unmatches)}`);
    }
  }
  if (skipList.length > 0) {
    filtered = filtered.filter((summary) =>
      !skipList.some((target) =>
        target.workflowFile === summary.workflowPath && (target.jobName ? (target.jobName === summary.jobName) : true)
      )
    );
  }

  const completed = filtered.filter((summary) => summary.runStatus === 'COMPLETED');

  const progress: Report['progress'] = completed.length === filtered.length
    ? 'done'
    : 'in_progress';
  const conclusion: Report['conclusion'] = completed.every((summary) => summary.acceptable)
    ? 'acceptable'
    : 'bad';

  return { progress, conclusion, summaries: filtered };
}
