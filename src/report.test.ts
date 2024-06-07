import test from 'node:test';
import assert from 'node:assert';
import { checks8679817057, checks92810686811WaitSuccessPolling1 } from './snapshot.ts';
import { Report, Summary, generateReport, getSummaries, readableDuration } from './report.ts';
import { omit } from './util.ts';
import { Temporal } from 'temporal-polyfill';
import { jsonEqual } from './assert.ts';

test('readableDuration', () => {
  assert.strictEqual(readableDuration(Temporal.Duration.from({ milliseconds: 454356 })), 'about 7 minutes 34 seconds');
  assert.strictEqual(readableDuration(Temporal.Duration.from({ milliseconds: 32100 })), 'about 32 seconds');
  assert.strictEqual(
    readableDuration(Temporal.Duration.from({ hours: 4, minutes: 100, seconds: 79 })),
    'about 5 hours 41 minutes 19 seconds',
  );
});

const exampleSummary = Object.freeze(
  {
    isAcceptable: false,
    isCompleted: false,
    workflowBasename: '.github/workflows/example.yml',
    isSameWorkflow: false,

    eventName: 'pull_request',

    checkSuiteStatus: 'IN_PROGRESS',
    checkSuiteConclusion: 'FAILURE',

    runDatabaseId: 42,
    jobName: 'An example job',
    checkRunUrl: 'https://example.com',
    runStatus: 'IN_PROGRESS',
    runConclusion: 'FAILURE',
    severity: 'error',
  } as const satisfies Summary,
);

test('wait-list', async (t) => {
  await t.test('basics', (_t) => {
    const trigger = {
      owner: 'kachick',
      repo: 'wait-other-jobs',
      'runId': 8679817057,
      ref: '760074f4f419b55cb864030c29ece58a689a42a2',
      jobId: 'wait-list',
      eventName: 'pull_request',
    };
    const report = generateReport(
      getSummaries(checks8679817057, trigger),
      trigger,
      Temporal.Duration.from({ seconds: 420 }),
      {
        waitList: [
          {
            'workflowFile': 'lint.yml',
            jobMatchMode: 'all',
            'optional': false,
            'eventName': 'pull_request',
            startupGracePeriod: Temporal.Duration.from({ seconds: 10 }),
          },
          {
            'workflowFile': 'merge-bot-pr.yml',
            'jobName': 'dependabot',
            jobMatchMode: 'exact',
            'optional': true,
            startupGracePeriod: Temporal.Duration.from({ seconds: 10 }),
          },
          {
            'workflowFile': 'THERE_ARE_NO_FILES_AS_THIS.yml',
            jobMatchMode: 'all',
            'optional': true,
            startupGracePeriod: Temporal.Duration.from({ seconds: 10 }),
          },
        ],
        skipList: [],
        shouldSkipSameWorkflow: false,
      },
    );

    assert.deepStrictEqual(omit<Report, 'summaries'>(report, ['summaries']), {
      done: true,
      logs: [],
      ok: true,
    });
  });

  await t.test('prefix mode matches more', (_t) => {
    const trigger = Object.freeze({
      owner: 'kachick',
      repo: 'wait-other-jobs',
      'runId': 92810686811,
      ref: '8c14d2a44d6dff4e69b0a3cacc2a14e416b44137',
      jobId: 'wait-success',
      eventName: 'pull_request',
    });
    const report = generateReport(
      [{
        ...exampleSummary,
        isAcceptable: true,
        isCompleted: false,
        runStatus: 'IN_PROGRESS',
        workflowBasename: 'ci.yml',
        jobName: 'quickstarter-success',
      }, {
        ...exampleSummary,
        isAcceptable: false,
        isCompleted: false,
        runStatus: 'IN_PROGRESS',
        workflowBasename: 'ci.yml',
        jobName: 'quickstarter-fail',
      }, {
        ...exampleSummary,
        isAcceptable: true,
        isCompleted: true,
        runStatus: 'COMPLETED',
        workflowBasename: 'ci.yml',
        jobName: 'another-success',
      }],
      trigger,
      Temporal.Duration.from({ seconds: 60 }),
      {
        'waitList': [
          {
            'workflowFile': 'ci.yml',
            'jobName': 'quickstarter-',
            jobMatchMode: 'prefix',
            'optional': false,
            startupGracePeriod: Temporal.Duration.from({ seconds: 10 }),
          },
        ],
        skipList: [],
        shouldSkipSameWorkflow: false,
      },
    );

    jsonEqual(omit<Report, 'summaries'>(report, ['summaries']), {
      done: false,
      logs: [
        {
          message: 'some jobs still in progress',
          resource: [
            {
              checkRunUrl: 'https://example.com',
              checkSuiteConclusion: 'FAILURE',
              checkSuiteStatus: 'IN_PROGRESS',
              eventName: 'pull_request',
              isAcceptable: true,
              isCompleted: false,
              isSameWorkflow: false,
              jobName: 'quickstarter-success',
              runConclusion: 'FAILURE',
              runDatabaseId: 42,
              runStatus: 'IN_PROGRESS',
              severity: 'error',
              workflowBasename: 'ci.yml',
            },
            {
              checkRunUrl: 'https://example.com',
              checkSuiteConclusion: 'FAILURE',
              checkSuiteStatus: 'IN_PROGRESS',
              eventName: 'pull_request',
              isAcceptable: false,
              isCompleted: false,
              isSameWorkflow: false,
              jobName: 'quickstarter-fail',
              runConclusion: 'FAILURE',
              runDatabaseId: 42,
              runStatus: 'IN_PROGRESS',
              severity: 'error',
              workflowBasename: 'ci.yml',
            },
          ],
          severity: 'info',
        },
      ],
      ok: true,
    });
  });

  await t.test('startupGracePeriod', async (t) => {
    const trigger = Object.freeze({
      owner: 'kachick',
      repo: 'wait-other-jobs',
      'runId': 92810686811,
      ref: '8c14d2a44d6dff4e69b0a3cacc2a14e416b44137',
      jobId: 'wait-success',
      eventName: 'pull_request',
    });
    await t.test('required slowstarting job and set enough grace period', (_t) => {
      const report = generateReport(
        getSummaries(checks92810686811WaitSuccessPolling1, trigger),
        trigger,
        Temporal.Duration.from({ milliseconds: Math.ceil(986.9570700004697) }),
        {
          'waitList': [
            {
              'workflowFile': 'GH-820-graceperiod.yml',
              'jobName': 'quickstarter-success',
              jobMatchMode: 'exact',
              'optional': false,
              'startupGracePeriod': Temporal.Duration.from({ seconds: 10 }),
            },
            {
              'workflowFile': 'GH-820-graceperiod.yml',
              'jobName': 'slowstarter-success',
              jobMatchMode: 'exact',
              'optional': false,
              'startupGracePeriod': Temporal.Duration.from({ seconds: 60 }),
            },
          ],
          skipList: [],
          shouldSkipSameWorkflow: false,
        },
      );

      jsonEqual(
        omit<Report, 'summaries'>(report, ['summaries']),
        {
          done: false,
          logs: [
            {
              message: 'some jobs still in progress',
              severity: 'info',
              resource: [
                {
                  isAcceptable: false,
                  isCompleted: false,
                  checkRunUrl: 'https://github.com/kachick/wait-other-jobs/actions/runs/9281068681/job/25536443631',
                  checkSuiteConclusion: null,
                  checkSuiteStatus: 'QUEUED',
                  eventName: 'pull_request',
                  isSameWorkflow: false,
                  jobName: 'quickstarter-success',
                  runConclusion: null,
                  runDatabaseId: 25536443631,
                  runStatus: 'QUEUED',
                  severity: 'warning',
                  workflowBasename: 'GH-820-graceperiod.yml',
                },
              ],
            },
            {
              message: 'Some expected jobs were not started',
              resource: [
                {
                  found: false,
                  jobName: 'slowstarter-success',
                  jobMatchMode: 'exact',
                  optional: false,
                  startupGracePeriod: 'PT60S',
                  workflowFile: 'GH-820-graceperiod.yml',
                },
              ],
              severity: 'warning',
            },
          ],
          ok: true,
        },
      );
    });

    await t.test('slowstarting job has been expired to the given period', (_t) => {
      const grace = Temporal.Duration.from({ seconds: 60 });
      const report = generateReport(
        getSummaries(checks92810686811WaitSuccessPolling1, trigger),
        trigger,
        grace.add({ milliseconds: 1 }),
        {
          'waitList': [
            {
              'workflowFile': 'GH-820-graceperiod.yml',
              'jobName': 'quickstarter-success',
              jobMatchMode: 'exact',
              'optional': false,
              'startupGracePeriod': Temporal.Duration.from({ seconds: 10 }),
            },
            {
              'workflowFile': 'GH-820-graceperiod.yml',
              'jobName': 'slowstarter-success',
              jobMatchMode: 'exact',
              'optional': false,
              'startupGracePeriod': grace,
            },
          ],
          skipList: [],
          shouldSkipSameWorkflow: false,
        },
      );

      jsonEqual(omit<Report, 'summaries'>(report, ['summaries']), {
        done: false,
        logs: [
          {
            message: 'some jobs still in progress',
            severity: 'info',
            resource: [
              {
                isAcceptable: false,
                isCompleted: false,
                checkRunUrl: 'https://github.com/kachick/wait-other-jobs/actions/runs/9281068681/job/25536443631',
                checkSuiteConclusion: null,
                checkSuiteStatus: 'QUEUED',
                eventName: 'pull_request',
                isSameWorkflow: false,
                jobName: 'quickstarter-success',
                runConclusion: null,
                runDatabaseId: 25536443631,
                runStatus: 'QUEUED',
                severity: 'warning',
                workflowBasename: 'GH-820-graceperiod.yml',
              },
            ],
          },
          {
            message: 'Failed to meet some runs on your specified wait-list',
            resource: [
              {
                found: false,
                jobName: 'slowstarter-success',
                jobMatchMode: 'exact',
                optional: false,
                startupGracePeriod: 'PT60S',
                workflowFile: 'GH-820-graceperiod.yml',
              },
            ],
            severity: 'error',
          },
        ],
        ok: false,
      });
    });

    await t.test('judges as expired for same durations', (_t) => {
      const report = generateReport(
        getSummaries(checks92810686811WaitSuccessPolling1, trigger),
        trigger,
        Temporal.Duration.from({ seconds: 60 }),
        {
          'waitList': [
            {
              'workflowFile': 'GH-820-graceperiod.yml',
              'jobName': 'quickstarter-success',
              jobMatchMode: 'exact',
              'optional': false,
              'startupGracePeriod': Temporal.Duration.from({ seconds: 10 }),
            },
            {
              'workflowFile': 'GH-820-graceperiod.yml',
              'jobName': 'slowstarter-success',
              jobMatchMode: 'exact',
              'optional': false,
              'startupGracePeriod': Temporal.Duration.from({ seconds: 60 }),
            },
          ],
          skipList: [],
          shouldSkipSameWorkflow: false,
        },
      );

      jsonEqual(omit<Report, 'summaries'>(report, ['summaries']), {
        done: false,
        logs: [
          {
            message: 'some jobs still in progress',
            severity: 'info',
            resource: [
              {
                isAcceptable: false,
                isCompleted: false,
                checkRunUrl: 'https://github.com/kachick/wait-other-jobs/actions/runs/9281068681/job/25536443631',
                checkSuiteConclusion: null,
                checkSuiteStatus: 'QUEUED',
                eventName: 'pull_request',
                isSameWorkflow: false,
                jobName: 'quickstarter-success',
                runConclusion: null,
                runDatabaseId: 25536443631,
                runStatus: 'QUEUED',
                severity: 'warning',
                workflowBasename: 'GH-820-graceperiod.yml',
              },
            ],
          },
          {
            message: 'Failed to meet some runs on your specified wait-list',
            resource: [
              {
                found: false,
                jobName: 'slowstarter-success',
                jobMatchMode: 'exact',
                optional: false,
                startupGracePeriod: 'PT60S',
                workflowFile: 'GH-820-graceperiod.yml',
              },
            ],
            severity: 'error',
          },
        ],
        ok: false,
      });
    });

    await t.test('mark bad for failures even if several runs are still in progress', (_t) => {
      const report = generateReport(
        [{
          ...exampleSummary,
          isAcceptable: true,
          isCompleted: true,
          runStatus: 'COMPLETED',
          workflowBasename: 'ci.yml',
          jobName: 'quickstarter-success',
        }, {
          ...exampleSummary,
          isAcceptable: false,
          isCompleted: true,
          runStatus: 'COMPLETED',
          workflowBasename: 'ci.yml',
          jobName: 'quickstarter-fail',
        }],
        trigger,
        Temporal.Duration.from({ minutes: 2 }),
        {
          'waitList': [
            {
              'workflowFile': 'ci.yml',
              'jobName': 'quickstarter-success',
              jobMatchMode: 'exact',
              'optional': false,
              'startupGracePeriod': Temporal.Duration.from({ minutes: 5 }),
            },
            {
              'workflowFile': 'ci.yml',
              'jobName': 'quickstarter-fail',
              jobMatchMode: 'exact',
              'optional': false,
              'startupGracePeriod': Temporal.Duration.from({ minutes: 5 }),
            },
            {
              'workflowFile': 'ci.yml',
              'jobName': 'slowstarter-missing',
              jobMatchMode: 'exact',
              'optional': false,
              'startupGracePeriod': Temporal.Duration.from({ minutes: 5 }),
            },
          ],
          skipList: [],
          shouldSkipSameWorkflow: false,
        },
      );

      jsonEqual(omit<Report, 'summaries'>(report, ['summaries']), {
        done: false,
        logs: [
          {
            message: 'some jobs failed',
            severity: 'error',
            resource: [
              {
                isAcceptable: false,
                isCompleted: true,
                checkRunUrl: 'https://example.com',
                checkSuiteConclusion: 'FAILURE',
                checkSuiteStatus: 'IN_PROGRESS',
                eventName: 'pull_request',
                isSameWorkflow: false,
                jobName: 'quickstarter-fail',
                runConclusion: 'FAILURE',
                runDatabaseId: 42,
                runStatus: 'COMPLETED',
                severity: 'error',
                workflowBasename: 'ci.yml',
              },
            ],
          },
          {
            message: 'Some expected jobs were not started',
            resource: [
              {
                found: false,
                jobName: 'slowstarter-missing',
                jobMatchMode: 'exact',
                optional: false,
                startupGracePeriod: 'PT5M',
                workflowFile: 'ci.yml',
              },
            ],
            severity: 'warning',
          },
        ],
        ok: false,
      });
    });
  });
});

test('skip-list', async (t) => {
  await t.test('ignores listed jobs', (_t) => {
    const trigger = {
      owner: 'kachick',
      repo: 'wait-other-jobs',
      'runId': 8679817057,
      ref: '760074f4f419b55cb864030c29ece58a689a42a2',
      jobId: 'skip-list',
      eventName: 'pull_request',
    };
    const exactReport = generateReport(
      getSummaries(checks8679817057, trigger),
      trigger,
      Temporal.Duration.from({ seconds: 420 }),
      {
        waitList: [],
        skipList: [
          {
            'workflowFile': 'itself.yml',
            jobMatchMode: 'all',
          },
          {
            'workflowFile': 'ci.yml',
            jobMatchMode: 'all',
          },
          {
            'workflowFile': 'ci-nix.yml',
            jobMatchMode: 'all',
          },
          {
            'workflowFile': 'merge-bot-pr.yml',
            'jobName': 'dependabot',
            jobMatchMode: 'exact',
          },
        ],
        shouldSkipSameWorkflow: false,
      },
    );

    assert.deepStrictEqual(omit<Report, 'summaries'>(exactReport, ['summaries']), {
      done: true,
      logs: [],
      ok: true,
    });
  });

  await t.test('prefix mode ignores more', (_t) => {
    const trigger = Object.freeze({
      owner: 'kachick',
      repo: 'wait-other-jobs',
      'runId': 92810686811,
      ref: '8c14d2a44d6dff4e69b0a3cacc2a14e416b44137',
      jobId: 'wait-success',
      eventName: 'pull_request',
    });
    const report = generateReport(
      [{
        ...exampleSummary,
        isAcceptable: true,
        isCompleted: false,
        runStatus: 'IN_PROGRESS',
        workflowBasename: 'ci.yml',
        jobName: 'quickstarter-success',
      }, {
        ...exampleSummary,
        isAcceptable: false,
        isCompleted: false,
        runStatus: 'IN_PROGRESS',
        workflowBasename: 'ci.yml',
        jobName: 'quickstarter-fail',
      }, {
        ...exampleSummary,
        isAcceptable: true,
        isCompleted: true,
        runStatus: 'COMPLETED',
        workflowBasename: 'ci.yml',
        jobName: 'another-success',
      }],
      trigger,
      Temporal.Duration.from({ seconds: 60 }),
      {
        waitList: [],
        'skipList': [
          {
            'workflowFile': 'ci.yml',
            'jobName': 'quickstarter-',
            jobMatchMode: 'prefix',
          },
        ],
        shouldSkipSameWorkflow: false,
      },
    );

    jsonEqual(omit<Report, 'summaries'>(report, ['summaries']), {
      done: true,
      logs: [],
      ok: true,
    });
  });
});
