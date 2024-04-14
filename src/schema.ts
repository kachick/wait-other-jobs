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
// if (waitList.length > 0 && skipList.length > 0) {
//   error('Do not specify both wait-list and skip-list');
//   setFailed('Specified both list');
// }

const retryMethods = z.enum(['exponential_backoff', 'equal_intervals']);
export type RetryMethod = z.infer<typeof retryMethods>;

// - Do not specify default values with zod. That is an action.yml role
// - Do not include secrets here, for example githubToken. See https://github.com/colinhacks/zod/issues/1783
export const Options = z.object({
  waitList: WaitFilterConditions,
  skipList: SkipFilterConditions,
  waitSecondsBeforeFirstPolling: z.number().min(0),
  minIntervalSeconds: z.number().min(1),
  retryMethod: retryMethods,
  attemptLimits: z.number().min(1),
  isEarlyExit: z.boolean(),
  shouldSkipSameWorkflow: z.boolean(),
  isDryRun: z.boolean(),
}).readonly();

export type Options = z.infer<typeof Options>;

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
