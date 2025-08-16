import { CheckSuite, Workflow, CheckRun, WorkflowRun } from '@octokit/graphql-schema';
import { emitWarning } from 'node:process';
import { Temporal } from 'temporal-polyfill';
import { z } from 'zod';

export const jsonSchema = z.json();

// ref: https://github.com/colinhacks/zod/discussions/2215#discussioncomment-13836018
export const jsonInput = z.string()
  .transform((str, ctx): z.infer<z.ZodJSONSchema> => {
    try {
      return jsonSchema.parse(JSON.parse(str));
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
        error: errorMessage,
      });
      return z.NEVER;
    }
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
// Empty means "all events"
export const eventNames = z.preprocess(
  (input) => {
    if (Array.isArray(input)) {
      return new Set(input);
    }

    return input;
  },
  z.set(eventName).readonly(),
);

const workflowPath = z.string().endsWith('.yml').or(z.string().endsWith('.yaml'));

// Empty list(Set) means "any".
// Initially I thought literal string might be better, however those union types are complex,
// and also complex for the parsing user inputs. Only use string array is simple in JSON
const anyEvents = Object.freeze(new Set([]));

const commonFilterCondition = {
  workflowFile: workflowPath,
  eventNames: eventNames.default(anyEvents),
};

const matchAllJobs = z.strictObject({
  ...commonFilterCondition,
  jobMatchMode: z.literal('all').default('all'),
});
const matchPartialJobs = z.strictObject({
  ...commonFilterCondition,
  jobName: z.string().min(1),
  jobMatchMode: z.enum(['exact', 'prefix']).default('exact'),
});

const commonFilterConditions = [matchAllJobs, matchPartialJobs] as const;

const waitOptions = {
  optional: z.boolean().default(false).readonly(),

  // Do not raise validation errors for the reasonability of max value.
  // Even in equal_intervals mode, we can't enforce the possibility of the whole running time
  startupGracePeriod: Durationable.default(defaultGrace),
};

// Keeping backward compatibility for eventName despite v4 cleanup,
// since this was changed right before v4 release to avoid major breaking changes.
const preprocessDeprecatedEventName = (input: Readonly<unknown>) => {
  if (!(typeof input === 'object' && input !== null)) {
    throw new Error('Invalid input');
  }

  if (!('eventName' in input)) {
    return input;
  }

  if ('eventNames' in input) {
    throw new Error("Don't set both eventName and eventNames together. Only use eventNames.");
  }

  emitWarning(
    "DEPRECATED: 'eventName' will be removed in v5. Use 'eventNames' instead.",
  );

  const { eventName, ...rest } = input;

  return { ...rest, eventNames: new Set([eventName]) };
};

const waitFilterCondition = z.union(
  commonFilterConditions.map((item) => z.preprocess(preprocessDeprecatedEventName, item.extend(waitOptions))),
);
const skipFilterCondition = z.union(commonFilterConditions);

const WaitList = z.array(waitFilterCondition).readonly();
const SkipList = z.array(skipFilterCondition).readonly();

const FilterCondition = z.union([waitFilterCondition, skipFilterCondition]);

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
  isEarlyExit: z.boolean(),
  shouldSkipSameWorkflow: z.boolean(),
  isDryRun: z.boolean(),
  eventNames,
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
