import type { CheckRun, CheckSuite, Workflow, WorkflowRun } from '@octokit/graphql-schema';
import { parse } from 'jsonc-parser';
import { Temporal } from 'temporal-polyfill';
import { z } from 'zod';

export const jsonSchema = z.json();

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

// Intentionally avoided to use enum for now. Only GitHub knows whole eventNames and the adding plans
const eventName = z.string().min(1);

const eventNamesBase = z.preprocess(
  (input) => {
    if (Array.isArray(input)) {
      return new Set(input);
    }

    return input;
  },
  z.set(eventName).readonly(),
);

export const eventNames = eventNamesBase.default(Object.freeze(new Set([]))).meta({
  // Initially I thought literal string might be better, however those union types are complex,
  // and also complex for the parsing user inputs. Only use string array is simple in JSON
  description: `Empty means "any"`,
});

const workflowPath = z.string().endsWith('.yml').or(z.string().endsWith('.yaml'));

const commonFilterConditionConfig = {
  workflowFile: workflowPath,
  eventNames: eventNamesBase.optional(),
  eventName: z.string().min(1).meta({ deprecated: true, description: 'Use `eventNames` instead.' }).optional(),
};

const commonFilterCondition = {
  workflowFile: workflowPath,
  eventNames: eventNamesBase,
};

const createMatchSchemas = <T extends typeof commonFilterConditionConfig | typeof commonFilterCondition>(base: T) => {
  const matchAllJobs = z.strictObject({
    ...base,
    jobMatchMode: z.literal('all').default('all'),
  });
  const matchPartialJobs = z.strictObject({
    ...base,
    jobName: z.string().min(1),
    jobMatchMode: z.enum(['exact', 'prefix']).default('exact'),
  });
  return [matchAllJobs, matchPartialJobs] as const;
};

const commonFilterConditionsConfig = createMatchSchemas(commonFilterConditionConfig);
const commonFilterConditions = createMatchSchemas(commonFilterCondition);

const waitOptions = {
  optional: z.boolean().default(false),

  // Do not raise validation errors for the reasonability of max value.
  // Even in equal_intervals mode, we can't enforce the possibility of the whole running time
  startupGracePeriod: Durationable.default(defaultGrace),
};

const waitFilterConditionConfig = z.union(
  commonFilterConditionsConfig.map((item) => item.extend(waitOptions)),
);
const skipFilterConditionConfig = z.union(commonFilterConditionsConfig);

const waitFilterCondition = z.union(
  commonFilterConditions.map((item) => item.extend(waitOptions)),
);
const skipFilterCondition = z.union(commonFilterConditions);

// Input Lists (optional eventNames)
export const WaitListConfig = z.array(waitFilterConditionConfig).readonly();
export const SkipListConfig = z.array(skipFilterConditionConfig).readonly();

export type WaitListConfig = z.infer<typeof WaitListConfig>;
export type SkipListConfig = z.infer<typeof SkipListConfig>;

// Normalized Lists (required eventNames)
export const WaitList = z.array(waitFilterCondition).readonly();
export const SkipList = z.array(skipFilterCondition).readonly();

const FilterCondition = z.union([waitFilterCondition, skipFilterCondition]);

export type FilterCondition = z.infer<typeof FilterCondition>;
export type WaitList = z.infer<typeof WaitList>;
export type SkipList = z.infer<typeof SkipList>;

const retryMethods = z.enum(['exponential_backoff', 'equal_intervals']);
export type RetryMethod = z.infer<typeof retryMethods>;

// - Do not specify default values with zod. That is an action.yml role
// - Do not include secrets here, for example githubToken. Even after https://github.com/colinhacks/zod/issues/1783 is resolved
const optionsBase = {
  apiUrl: z.url(),
  warmupDelay: ZeroableDuration,
  minimumInterval: PositiveDuration,
  retryMethod: retryMethods,
  attemptLimits: z.number().min(1),
  eventNames,
  isEarlyExitEnabled: z.boolean(),
  isSkipSameWorkflowEnabled: z.boolean(),
  isDryRunEnabled: z.boolean(),
};

export const ConfigOptions = z.strictObject({
  ...optionsBase,
  waitList: WaitListConfig,
  skipList: SkipListConfig,
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

export type ConfigOptions = z.infer<typeof ConfigOptions>;

export const RuntimeOptions = z.strictObject({
  ...optionsBase,
  waitList: WaitList,
  skipList: SkipList,
}).readonly();

export const Path = z.string().min(1);

export type RuntimeOptions = z.infer<typeof RuntimeOptions>;

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
