import { CheckSuite, Workflow, CheckRun } from '@octokit/graphql-schema';
import { z } from 'zod';

const FilterCondition = z.object({
  workflowFile: z.string().endsWith('.yml'),
  jobName: (z.string().min(1)).optional(),
});

const SkipFilterCondition = FilterCondition.readonly();
export const SkipFilterConditions = z.array(SkipFilterCondition).readonly();
export type SkipFilterConditions = z.infer<typeof SkipFilterConditions>;

const WaitFilterCondition = FilterCondition.extend(
  { optional: z.boolean().optional().default(false).readonly() },
).readonly();
export const WaitFilterConditions = z.array(WaitFilterCondition).readonly();
export type WaitFilterConditions = z.infer<typeof WaitFilterConditions>;

export interface Trigger {
  owner: string;
  repo: string;
  ref: string;
  runId: number;
  jobName: string;
}

export interface Summary {
  acceptable: boolean; // Set by us
  workflowPath: string; // Set by us
  isSameWorkflow: boolean; // Set by us

  checkSuiteStatus: CheckSuite['status'];
  checkSuiteConclusion: CheckSuite['conclusion'];

  workflowName: Workflow['name'];

  runDatabaseId: CheckRun['databaseId'];
  jobName: CheckRun['name'];
  checkRunUrl: CheckRun['detailsUrl'];
  runStatus: CheckRun['status'];
  runConclusion: CheckRun['conclusion']; // null if status is in progress
}
