import { CheckSuite, Workflow, CheckRun, WorkflowRun } from '@octokit/graphql-schema';
import { Temporal } from 'temporal-polyfill';
import { z } from 'zod';

// https://github.com/tc39/proposal-temporal/blob/26e4cebe3c49f56932c1d5064fec9993e981823a/polyfill/index.d.ts#L493-L504
type DurationLike = {
  years?: number;
  months?: number;
  weeks?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
  microseconds?: number;
  nanoseconds?: number;
};

// Need both zod definition and actual type which used in Temporal.Duration
// This is a known zod problem with exactOptionalPropertyTypes.
// See https://github.com/colinhacks/zod/issues/635 for detail
const MyDurationLike = z.object({
  years: z.number().optional(),
  months: z.number().optional(),
  weeks: z.number().optional(),
  days: z.number().optional(),
  hours: z.number().optional(),
  minutes: z.number().optional(),
  seconds: z.number().optional(),
  milliseconds: z.number().optional(),
  microseconds: z.number().optional(),
  nanoseconds: z.number().optional(),
}).strict().readonly();

type MyDurationLike = z.infer<typeof MyDurationLike>;

const Durationable = z.union([z.string().duration(), MyDurationLike]);
type Dirationable = z.infer<typeof Durationable>;

// workaround for https://github.com/colinhacks/zod/issues/635
function isDurationLike(my: MyDurationLike): my is DurationLike {
  for (const [_, value] of Object.entries(my)) {
    if (value === undefined) {
      return false;
    }
  }

  return true;
}

// workaround for https://github.com/colinhacks/zod/issues/635
export function getDuration(durationable: Dirationable): Temporal.Duration {
  if (typeof durationable === 'string' || isDurationLike(durationable)) {
    return Temporal.Duration.from(durationable);
  }

  throw new Error('unexpected value is specified in durations');
}

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
    startupGracePeriod: Durationable.default({ seconds: 10 }),
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
