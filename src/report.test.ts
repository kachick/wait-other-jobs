import test from 'node:test';
import assert from 'node:assert';
import { checks8679817057, checks92810686811WaitSuccessPolling1 } from './snapshot.ts';
import { Report, generateReport } from './report.ts';
import { omit } from './util.ts';
import { Temporal } from 'temporal-polyfill';

test('wait-list', async (t) => {
  await t.test('basics', (_t) => {
    const report = generateReport(
      checks8679817057,
      {
        owner: 'kachick',
        repo: 'wait-other-jobs',
        'runId': 8679817057,
        ref: '760074f4f419b55cb864030c29ece58a689a42a2',
        jobName: 'wait-list',
        eventName: 'pull_request',
      },
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

    assert.deepEqual({
      conclusion: 'acceptable',
      progress: 'done',
      description: 'all jobs passed',
    }, omit<Report, 'summaries'>(report, ['summaries']));
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
        checks92810686811WaitSuccessPolling1,
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

      assert.deepEqual({
        conclusion: 'acceptable',
        progress: 'in_progress',
        description:
          'Some expected jobs were not started: [{"workflowFile":"GH-820-graceperiod.yml","jobName":"slowstarter-success","optional":false,"startupGracePeriod":{"seconds":60},"found":false}]',
      }, omit<Report, 'summaries'>(report, ['summaries']));
    });

    await t.test('slowstarting job has been expired to the given period', (_t) => {
      const report = generateReport(
        checks92810686811WaitSuccessPolling1,
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

      assert.deepEqual({
        conclusion: 'bad',
        progress: 'in_progress',
        description:
          'Failed to meet some runs on your specified wait-list: [{"workflowFile":"GH-820-graceperiod.yml","jobName":"slowstarter-success","optional":false,"startupGracePeriod":{"seconds":60},"found":false}]',
      }, omit<Report, 'summaries'>(report, ['summaries']));
    });

    await t.test('judges as expired for same durations', (_t) => {
      const report = generateReport(
        checks92810686811WaitSuccessPolling1,
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

      assert.deepEqual({
        conclusion: 'bad',
        progress: 'in_progress',
        description:
          'Failed to meet some runs on your specified wait-list: [{"workflowFile":"GH-820-graceperiod.yml","jobName":"slowstarter-success","optional":false,"startupGracePeriod":{"seconds":60},"found":false}]',
      }, omit<Report, 'summaries'>(report, ['summaries']));
    });
  });
});

test('skip-list', () => {
  const report = generateReport(
    checks8679817057,
    {
      owner: 'kachick',
      repo: 'wait-other-jobs',
      'runId': 8679817057,
      ref: '760074f4f419b55cb864030c29ece58a689a42a2',
      jobName: 'skip-list',
      eventName: 'pull_request',
    },
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

  assert.deepEqual({
    conclusion: 'acceptable',
    progress: 'done',
    description: 'all jobs passed',
  }, omit<Report, 'summaries'>(report, ['summaries']));
});
