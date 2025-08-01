import { CheckSuite, Workflow, CheckRun, WorkflowRun } from '@octokit/graphql-schema';
import { Temporal } from 'temporal-polyfill';
import { z } from 'zod';

// ref: https://github.com/colinhacks/zod/blob/e30870369d5b8f31ff4d0130d4439fd997deb523/README.md?plain=1#L1922-L1935
const jsonLiteral = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof jsonLiteral>;
type Json = Literal | { [key: string]: Json } | Json[];
const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([jsonLiteral, z.array(jsonSchema), z.record(z.string(), jsonSchema)])
);

// ref: https://github.com/colinhacks/zod/discussions/2215
export const jsonInput = z.string()
  .transform((str, ctx): z.infer<z.ZodType<Json>> => {
    try {
      return JSON.parse(str);
    } catch (_err) {
      const errorMessage = `Invalid JSON.
Typical mistakens are below.
  - Trailing comma
    Bad: [a,b,]
    Good: [a,b]
  - Missing quotations for object key
    Bad: {a: 1}
    Good: {"a": 1}
`;
      ctx.addIssue({
        code: 'custom',
        message: errorMessage,
      });
      return z.NEVER;
    }
  });

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

// IETF does not define duration formats in their RFCs, but in RFC 3399 refers ISO 8601 duration formats.
// https://www.ietf.org/rfc/rfc3339.txt
export const Durationable = z.union([z.iso.duration(), MyDurationLike]).transform((item) => getDuration(item));
export const PositiveDuration = z.instanceof(Temporal.Duration).refine(
  (d) => d.sign > 0,
  {
    message: 'Too short interval for pollings',
  },
);
export const ZeroableDuration = z.instanceof(Temporal.Duration).refine(
  (d) => d.sign >= 0,
  {
    message: 'Negative intervals are not reasonable for pollings',
  },
);
const defaultGrace = Temporal.Duration.from({ seconds: 10 });

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
export function getDuration(durationable: string | MyDurationLike): Temporal.Duration {
  if (typeof durationable === 'string' || isDurationLike(durationable)) {
    return Temporal.Duration.from(durationable);
  }

  throw new Error('unexpected value is specified in durations');
}

export const yamlPattern = /\.(yml|yaml)$/;
const workflowFile = z.string().regex(yamlPattern);
const matchAllJobs = z.object({
  workflowFile: workflowFile,
  jobName: z.null().optional(), // Keep optional for backward compatibility. TODO: Remove since v4
  jobMatchMode: z.literal('all').default('all'),
}).strict();
const matchPartialJobs = z.object({
  workflowFile: workflowFile,
  jobName: z.string().min(1),
  jobMatchMode: z.enum(['exact', 'prefix']).default('exact'),
}).strict();

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
  matchAllJobs.extend(waitOptions).strict(),
  matchPartialJobs.extend(waitOptions).strict(),
]).readonly();
const WaitList = z.array(WaitFilterCondition).readonly();
const SkipList = z.array(SkipFilterCondition).readonly();
export type FilterCondition = z.infer<typeof FilterCondition>;
export type WaitList = z.infer<typeof WaitList>;

const retryMethods = z.enum(['exponential_backoff', 'equal_intervals']);
export type RetryMethod = z.infer<typeof retryMethods>;

// - Do not specify default values with zod. That is an action.yml role
// - Do not include secrets here, for example githubToken. See https://github.com/colinhacks/zod/issues/1783
export const Options = z.object({
  apiUrl: z.url(),
  waitList: WaitList,
  skipList: SkipList,
  warmupDelay: ZeroableDuration,
  minimumInterval: PositiveDuration,
  retryMethod: retryMethods,
  attemptLimits: z.number().min(1),
  isEarlyExit: z.boolean(),
  shouldSkipSameWorkflow: z.boolean(),
  isDryRun: z.boolean(),
}).strict().readonly().refine(
  ({ waitList, skipList }) => !(waitList.length > 0 && skipList.length > 0),
  { message: 'Do not specify both wait-list and skip-list', path: ['waitList', 'skipList'] },
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
    message: 'A shorter startupGracePeriod waiting for the first poll does not make sense',
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
