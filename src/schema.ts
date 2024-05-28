import { CheckSuite, Workflow, CheckRun, WorkflowRun } from '@octokit/graphql-schema';
import { z } from 'zod';

const FilterCondition = z.object({
  workflowFile: z.string().endsWith('.yml'),
  jobName: (z.string().min(1)).optional(),
});
const SkipFilterCondition = FilterCondition.readonly();
const WaitFilterCondition = FilterCondition.extend(
  {
    optional: z.boolean().optional().default(false).readonly(),
    // - Intentionally avoided to use enum for now. Only GitHub knows whole eventNames and the adding plans
    // - Intentionally omitted in skip-list, let me know if you have the use-case
    eventName: z.string().min(1).optional(),
    marginOfStartingSeconds: z.number().min(0).optional().default(0),
  },
).readonly();

const retryMethods = z.enum(['exponential_backoff', 'equal_intervals']);
export type RetryMethod = z.infer<typeof retryMethods>;

// - Do not specify default values with zod. That is an action.yml role
// - Do not include secrets here, for example githubToken. See https://github.com/colinhacks/zod/issues/1783
export const Options = z.object({
  waitList: z.array(WaitFilterCondition).readonly(),
  skipList: z.array(SkipFilterCondition).readonly(),
  waitSecondsBeforeFirstPolling: z.number().min(0),
  minIntervalSeconds: z.number().min(1),
  retryMethod: retryMethods,
  attemptLimits: z.number().min(1),
  isEarlyExit: z.boolean(),
  shouldSkipSameWorkflow: z.boolean(),
  isDryRun: z.boolean(),
}).readonly().refine(
  ({ waitList, skipList }) => !(waitList.length > 0 && skipList.length > 0),
  { message: 'Do not specify both wait-list and skip-list', path: ['waitList', 'skipList'] },
);

export type Options = z.infer<typeof Options>;

export interface Trigger {
  owner: string;
  repo: string;
  ref: string;
  runId: number;
  jobName: string;
  eventName: string;
}

export interface Check {
  checkRun: CheckRun;
  checkSuite: CheckSuite;
  workflow: Workflow;
  workflowRun: WorkflowRun;
}
