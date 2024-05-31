import test from 'node:test';
import assert from 'node:assert';
import { checks8679817057, checks92810686811WaitSuccessPolling1 } from './snapshot.ts';
import { Report, Summary, generateReport, getSummaries } from './report.ts';
import { omit } from './util.ts';
import { Temporal } from 'temporal-polyfill';

const exampleSummary = Object.freeze(
  {
    acceptable: false,
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
  } satisfies Summary,
);

test.skip('wait-list', async (t) => {
  await t.test('basics', (_t) => {
    const trigger = {
      owner: 'kachick',
      repo: 'wait-other-jobs',
      'runId': 8679817057,
      ref: '760074f4f419b55cb864030c29ece58a689a42a2',
      jobName: 'wait-list',
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
            'optional': false,
            'eventName': 'pull_request',
            startupGracePeriod: { seconds: 10 },
          },
          {
            'workflowFile': 'merge-bot-pr.yml',
            'jobName': 'dependabot',
            'optional': true,
            startupGracePeriod: { seconds: 10 },
          },
          {
            'workflowFile': 'THERE_ARE_NO_FILES_AS_THIS.yml',
            'optional': true,
            startupGracePeriod: { seconds: 10 },
          },
        ],
        skipList: [],
        shouldSkipSameWorkflow: false,
      },
    );

    assert.deepEqual(omit<Report, 'summaries'>(report, ['summaries']), {
      conclusion: 'acceptable',
      logs: [
        {
          message: 'all jobs passed',
          severity: 'notice',
        },
      ],
      progress: 'done',
    });
  });

  await t.test('startupGracePeriod', async (t) => {
    const trigger = Object.freeze({
      owner: 'kachick',
      repo: 'wait-other-jobs',
      'runId': 92810686811,
      ref: '8c14d2a44d6dff4e69b0a3cacc2a14e416b44137',
      jobName: 'wait-success',
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
              'optional': false,
              'startupGracePeriod': { seconds: 10 },
            },
            {
              'workflowFile': 'GH-820-graceperiod.yml',
              'jobName': 'slowstarter-success',
              'optional': false,
              'startupGracePeriod': { seconds: 60 },
            },
          ],
          skipList: [],
          shouldSkipSameWorkflow: false,
        },
      );

      assert.deepEqual(omit<Report, 'summaries'>(report, ['summaries']), {
        conclusion: 'acceptable',
        logs: [
          {
            message: 'some jobs still in progress',
            severity: 'info',
          },
          {
            message: 'Some expected jobs were not started',
            resource: [
              {
                found: false,
                jobName: 'slowstarter-success',
                optional: false,
                startupGracePeriod: {
                  seconds: 60,
                },
                workflowFile: 'GH-820-graceperiod.yml',
              },
            ],
            severity: 'warning',
          },
        ],
        progress: 'in_progress',
      });
    });

    await t.test('slowstarting job has been expired to the given period', (_t) => {
      const report = generateReport(
        getSummaries(checks92810686811WaitSuccessPolling1, trigger),
        trigger,
        Temporal.Duration.from({ seconds: 60, milliseconds: 1 }),
        {
          'waitList': [
            {
              'workflowFile': 'GH-820-graceperiod.yml',
              'jobName': 'quickstarter-success',
              'optional': false,
              'startupGracePeriod': { seconds: 10 },
            },
            {
              'workflowFile': 'GH-820-graceperiod.yml',
              'jobName': 'slowstarter-success',
              'optional': false,
              'startupGracePeriod': { seconds: 60 },
            },
          ],
          skipList: [],
          shouldSkipSameWorkflow: false,
        },
      );

      assert.deepEqual(omit<Report, 'summaries'>(report, ['summaries']), {
        conclusion: 'bad',
        logs: [
          {
            message: 'some jobs still in progress',
            severity: 'info',
          },
          {
            message: 'Failed to meet some runs on your specified wait-list',
            resource: [
              {
                found: false,
                jobName: 'slowstarter-success',
                optional: false,
                startupGracePeriod: {
                  seconds: 60,
                },
                workflowFile: 'GH-820-graceperiod.yml',
              },
            ],
            severity: 'error',
          },
        ],
        progress: 'in_progress',
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
              'optional': false,
              'startupGracePeriod': { seconds: 10 },
            },
            {
              'workflowFile': 'GH-820-graceperiod.yml',
              'jobName': 'slowstarter-success',
              'optional': false,
              'startupGracePeriod': { seconds: 60 },
            },
          ],
          skipList: [],
          shouldSkipSameWorkflow: false,
        },
      );

      assert.deepEqual(omit<Report, 'summaries'>(report, ['summaries']), {
        conclusion: 'bad',
        logs: [
          {
            message: 'some jobs still in progress',
            severity: 'info',
          },
          {
            message: 'Failed to meet some runs on your specified wait-list',
            resource: [
              {
                found: false,
                jobName: 'slowstarter-success',
                optional: false,
                startupGracePeriod: {
                  seconds: 60,
                },
                workflowFile: 'GH-820-graceperiod.yml',
              },
            ],
            severity: 'error',
          },
        ],
        progress: 'in_progress',
      });
    });

    await t.test('mark bad for failures even if several runs are still in progress', (_t) => {
      const report = generateReport(
        [{
          ...exampleSummary,
          acceptable: true,
          runStatus: 'COMPLETED',
          workflowBasename: 'ci.yml',
          jobName: 'quickstarter-success',
        }, {
          ...exampleSummary,
          acceptable: false,
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
              'optional': false,
              'startupGracePeriod': { minutes: 5 },
            },
            {
              'workflowFile': 'ci.yml',
              'jobName': 'quickstarter-fail',
              'optional': false,
              'startupGracePeriod': { minutes: 5 },
            },
            {
              'workflowFile': 'ci.yml',
              'jobName': 'slowstarter-missing',
              'optional': false,
              'startupGracePeriod': { minutes: 5 },
            },
          ],
          skipList: [],
          shouldSkipSameWorkflow: false,
        },
      );

      assert.deepEqual(omit<Report, 'summaries'>(report, ['summaries']), {
        conclusion: 'bad',
        logs: [
          {
            message: 'some jobs failed',
            severity: 'error',
          },
          {
            message: 'Some expected jobs were not started',
            resource: [
              {
                found: false,
                jobName: 'slowstarter-missing',
                optional: false,
                startupGracePeriod: {
                  minutes: 5,
                },
                workflowFile: 'ci.yml',
              },
            ],
            severity: 'warning',
          },
        ],
        progress: 'in_progress',
      });
    });
  });
});

test.skip('skip-list', () => {
  const trigger = {
    owner: 'kachick',
    repo: 'wait-other-jobs',
    'runId': 8679817057,
    ref: '760074f4f419b55cb864030c29ece58a689a42a2',
    jobName: 'skip-list',
    eventName: 'pull_request',
  };
  const report = generateReport(
    getSummaries(checks8679817057, trigger),
    trigger,
    Temporal.Duration.from({ seconds: 420 }),
    {
      waitList: [],
      skipList: [
        {
          'workflowFile': 'itself.yml',
        },
        {
          'workflowFile': 'ci.yml',
        },
        {
          'workflowFile': 'ci-nix.yml',
        },
        {
          'workflowFile': 'merge-bot-pr.yml',
          'jobName': 'dependabot',
        },
      ],
      shouldSkipSameWorkflow: false,
    },
  );

  assert.deepEqual(omit<Report, 'summaries'>(report, ['summaries']), {
    conclusion: 'acceptable',
    logs: [
      {
        message: 'all jobs passed',
        severity: 'notice',
      },
    ],
    progress: 'done',
  });
});
