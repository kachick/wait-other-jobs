import test from 'node:test';
import assert from 'node:assert';
import { checks8679817057, checks92810686811WaitSuccessPolling1 } from './snapshot.ts';
import { Report, Summary, generateReport, getSummaries } from './report.ts';
import { omit } from './util.ts';
import { Temporal } from '@js-temporal/polyfill';

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
  } satisfies Summary,
);

test('wait-list', async (t) => {
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
            startupGracePeriod: Temporal.Duration.from({ seconds: 10 }),
          },
          {
            'workflowFile': 'merge-bot-pr.yml',
            'jobName': 'dependabot',
            'optional': true,
            startupGracePeriod: Temporal.Duration.from({ seconds: 10 }),
          },
          {
            'workflowFile': 'THERE_ARE_NO_FILES_AS_THIS.yml',
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
              'startupGracePeriod': Temporal.Duration.from({ seconds: 10 }),
            },
            {
              'workflowFile': 'GH-820-graceperiod.yml',
              'jobName': 'slowstarter-success',
              'optional': false,
              'startupGracePeriod': Temporal.Duration.from({ seconds: 60 }),
            },
          ],
          skipList: [],
          shouldSkipSameWorkflow: false,
        },
      );

      assert.deepStrictEqual(omit<Report, 'summaries'>(report, ['summaries']), {
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
                optional: false,
                startupGracePeriod: Temporal.Duration.from({
                  seconds: 60,
                }),
                workflowFile: 'GH-820-graceperiod.yml',
              },
            ],
            severity: 'warning',
          },
        ],
        ok: true,
      });
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
              'optional': false,
              'startupGracePeriod': Temporal.Duration.from({ seconds: 10 }),
            },
            {
              'workflowFile': 'GH-820-graceperiod.yml',
              'jobName': 'slowstarter-success',
              'optional': false,
              'startupGracePeriod': grace,
            },
          ],
          skipList: [],
          shouldSkipSameWorkflow: false,
        },
      );

      assert.deepStrictEqual(omit<Report, 'summaries'>(report, ['summaries']), {
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
                optional: false,
                startupGracePeriod: Temporal.Duration.from('PT60S'),
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
              'optional': false,
              'startupGracePeriod': Temporal.Duration.from({ seconds: 10 }),
            },
            {
              'workflowFile': 'GH-820-graceperiod.yml',
              'jobName': 'slowstarter-success',
              'optional': false,
              'startupGracePeriod': Temporal.Duration.from({ seconds: 60 }),
            },
          ],
          skipList: [],
          shouldSkipSameWorkflow: false,
        },
      );

      assert.deepStrictEqual(omit<Report, 'summaries'>(report, ['summaries']), {
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
                optional: false,
                startupGracePeriod: Temporal.Duration.from({
                  seconds: 60,
                }),
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
              'optional': false,
              'startupGracePeriod': Temporal.Duration.from({ minutes: 5 }),
            },
            {
              'workflowFile': 'ci.yml',
              'jobName': 'quickstarter-fail',
              'optional': false,
              'startupGracePeriod': Temporal.Duration.from({ minutes: 5 }),
            },
            {
              'workflowFile': 'ci.yml',
              'jobName': 'slowstarter-missing',
              'optional': false,
              'startupGracePeriod': Temporal.Duration.from({ minutes: 5 }),
            },
          ],
          skipList: [],
          shouldSkipSameWorkflow: false,
        },
      );

      assert.deepStrictEqual(omit<Report, 'summaries'>(report, ['summaries']), {
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
                optional: false,
                startupGracePeriod: Temporal.Duration.from({
                  minutes: 5,
                }),
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

test('skip-list', () => {
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

  assert.deepStrictEqual(omit<Report, 'summaries'>(report, ['summaries']), {
    done: true,
    logs: [],
    ok: true,
  });
});
