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

export interface Check {
  checkRun: CheckRun;
  checkSuite: CheckSuite;
  workflow: Workflow;
}
