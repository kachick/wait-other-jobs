import { SkipFilterConditions, Summary, Trigger, WaitFilterConditions } from './schema.js';

// No need to keep as same as GitHub responses so We can change the definition.
export interface Report {
  progress: 'in_progress' | 'done';
  conclusion: 'acceptable' | 'bad';
  filteredSummaries: Summary[];
}

export function generateReport(
  summaries: Summary[],
  trigger: Trigger,
  waitList: WaitFilterConditions,
  skipList: SkipFilterConditions,
  shouldSkipSameWorkflow: boolean,
): Report {
  if (waitList.length > 0 && skipList.length > 0) {
    throw new Error('Do not specify both wait-list and skip-list');
  }

  const others = summaries.filter((summary) => !(summary.isSameWorkflow && (trigger.jobName === summary.jobName)));
  let filtered = others.filter((summary) => !(summary.isSameWorkflow && shouldSkipSameWorkflow));

  if (waitList.length > 0) {
    const seeker = waitList.map((condition) => ({ ...condition, found: false }));
    filtered = filtered.filter((summary) =>
      seeker.some((target) => {
        if (
          target.workflowFile === summary.workflowPath && (target.jobName ? (target.jobName === summary.jobName) : true)
        ) {
          target.found = true;
          return true;
        } else {
          return false;
        }
      })
    );

    const unmatches = seeker.filter((result) => (!(result.found)) && (!(result.optional)));

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

  return { progress, conclusion, filteredSummaries: filtered };
}
