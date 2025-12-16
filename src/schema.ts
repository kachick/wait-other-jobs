import type { CheckRun, CheckSuite, Workflow, WorkflowRun } from '@octokit/graphql-schema';
import { parse } from 'jsonc-parser';
import { Temporal } from 'temporal-polyfill';
import { z } from 'zod';

const jsonSchema = z.json();

// ref: https://github.com/colinhacks/zod/discussions/2215#discussioncomment-13836018
export const jsonInput = z.string().transform((str): z.infer<z.ZodJSONSchema> => {
  const untypedJsonc = parse(str, [], { allowTrailingComma: true, disallowComments: false });
  return jsonSchema.parse(untypedJsonc);
});

// IETF does not define duration formats in their RFCs, but in RFC 3399 refers ISO 8601 duration formats.
// https://www.ietf.org/rfc/rfc3339.txt
// NOTE: `.transform()` causes it cannot be useable in `.toJSONSchema()`
export const Durationable = z.union([z.iso.duration(), z.instanceof(Temporal.Duration)]).transform((item) =>
  Temporal.Duration.from(item)
);
export const PositiveDuration = z.instanceof(Temporal.Duration).refine(
  (d) => d.sign > 0,
  {
    error: 'Too short interval for pollings',
  },
);
export const ZeroableDuration = z.instanceof(Temporal.Duration).refine(
  (d) => d.sign >= 0,
  {
    error: 'Negative intervals are not reasonable for pollings',
  },
);
const defaultGrace = Temporal.Duration.from({ seconds: 10 });

const workflowPath = z.string().endsWith('.yml').or(z.string().endsWith('.yaml'));
const matchAllJobs = z.strictObject({
  workflowFile: workflowPath,
  jobMatchMode: z.literal('all').default('all'),
});
const matchPartialJobs = z.strictObject({
  workflowFile: workflowPath,
  jobName: z.string().min(1),
  jobMatchMode: z.enum(['exact', 'prefix']).default('exact'),
});

const FilterCondition = z.union([matchAllJobs, matchPartialJobs]);
const SkipFilterCondition = FilterCondition.readonly();

const waitOptions = {
  optional: z.boolean().default(false).readonly(),

  // - Intentionally avoided to use enum for now. Only GitHub knows whole eventNames and the adding plans
  // - Intentionally omitted in skip-list, let me know if you have the use-case
  eventName: z.string().min(1).optional(),

  // Do not raise validation errors for the reasonability of max value.
  // Even in equal_intervals mode, we can't enforce the possibility of the whole running time
  startupGracePeriod: Durationable.default(defaultGrace),
};

const WaitFilterCondition = z.union([
  z.strictObject(matchAllJobs.extend(waitOptions).shape),
  z.strictObject(matchPartialJobs.extend(waitOptions).shape),
]).readonly();
const WaitList = z.array(WaitFilterCondition).readonly();
const SkipList = z.array(SkipFilterCondition).readonly();
export type FilterCondition = z.infer<typeof FilterCondition>;
export type WaitList = z.infer<typeof WaitList>;

const retryMethods = z.enum(['exponential_backoff', 'equal_intervals']);
export type RetryMethod = z.infer<typeof retryMethods>;

// - Do not specify default values with zod. That is an action.yml role
// - Do not include secrets here, for example githubToken. Even after https://github.com/colinhacks/zod/issues/1783 is resolved
export const Options = z.strictObject({
  apiUrl: z.url(),
  waitList: WaitList,
  skipList: SkipList,
  warmupDelay: ZeroableDuration,
  minimumInterval: PositiveDuration,
  retryMethod: retryMethods,
  attemptLimits: z.number().min(1),
  isEarlyExitEnabled: z.boolean(),
  isSkipSameWorkflowEnabled: z.boolean(),
  isDryRunEnabled: z.boolean(),
}).readonly().refine(
  ({ waitList, skipList }) => !(waitList.length > 0 && skipList.length > 0),
  { error: 'Do not specify both wait-list and skip-list', path: ['waitList', 'skipList'] },
).refine(
  ({ warmupDelay, waitList }) =>
    waitList.every(
      (item) =>
        !(Temporal.Duration.compare(
              warmupDelay,
              item.startupGracePeriod,
            ) > 0
          && Temporal.Duration.compare(item.startupGracePeriod, defaultGrace) !== 0),
    ),
  {
    error: 'A shorter startupGracePeriod waiting for the first poll does not make sense',
    path: ['warmupDelay', 'waitList'],
  },
);

export const Path = z.string().min(1);

export type Options = z.infer<typeof Options>;

export interface Trigger {
  owner: string;
  repo: string;
  ref: string;
  runId: number;
  jobId: string;
  eventName: string;
}

export interface Check {
  checkRun: CheckRun;
  checkSuite: CheckSuite;
  workflow: Workflow;
  workflowRun: WorkflowRun;
}
