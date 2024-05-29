import test from 'node:test';
import assert from 'node:assert';
import { checks8679817057, checks92810686811WaitSuccessPolling1 } from './snapshot.ts';
import { generateReport } from './report.ts';
import { pick } from './util.ts';

test('wait-list', () => {
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
    420000,
    {
      waitList: [
        {
          'workflowFile': 'lint.yml',
          'optional': false,
          'eventName': 'pull_request',
          marginOfStartingSeconds: 0,
        },
        {
          'workflowFile': 'merge-bot-pr.yml',
          'jobName': 'dependabot',
          'optional': true,
          marginOfStartingSeconds: 0,
        },
        {
          'workflowFile': 'THERE_ARE_NO_FILES_AS_THIS.yml',
          'optional': true,
          marginOfStartingSeconds: 0,
        },
      ],
      skipList: [],
      shouldSkipSameWorkflow: false,
    },
  );

  assert.deepEqual({
    conclusion: 'acceptable',
    progress: 'done',
  }, pick(report, ['conclusion', 'progress']));
});

test('wait-list have slowstarting job and set enough marginOfStartingSeconds', () => {
  const report = generateReport(
    checks92810686811WaitSuccessPolling1,
    {
      owner: 'kachick',
      repo: 'wait-other-jobs',
      'runId': 92810686811,
      ref: '8c14d2a44d6dff4e69b0a3cacc2a14e416b44137',
      jobName: 'wait-success',
      eventName: 'pull_request',
    },
    986.9570700004697,
    {
      'waitList': [
        {
          'workflowFile': 'GH-820-margin.yml',
          'jobName': 'quickstarter-success',
          'optional': false,
          'marginOfStartingSeconds': 0,
        },
        {
          'workflowFile': 'GH-820-margin.yml',
          'jobName': 'slowstarter-success',
          'optional': false,
          'marginOfStartingSeconds': 60,
        },
      ],
      skipList: [],
      shouldSkipSameWorkflow: false,
    },
  );

  assert.deepEqual({
    conclusion: 'acceptable',
    progress: 'in_progress',
  }, pick(report, ['conclusion', 'progress']));
});

test('wait-list have slowstarting job and expired', () => {
  const report = generateReport(
    checks92810686811WaitSuccessPolling1,
    {
      owner: 'kachick',
      repo: 'wait-other-jobs',
      'runId': 92810686811,
      ref: '8c14d2a44d6dff4e69b0a3cacc2a14e416b44137',
      jobName: 'wait-success',
      eventName: 'pull_request',
    },
    60 * 1000,
    {
      'waitList': [
        {
          'workflowFile': 'GH-820-margin.yml',
          'jobName': 'quickstarter-success',
          'optional': false,
          'marginOfStartingSeconds': 0,
        },
        {
          'workflowFile': 'GH-820-margin.yml',
          'jobName': 'slowstarter-success',
          'optional': false,
          'marginOfStartingSeconds': 60,
        },
      ],
      skipList: [],
      shouldSkipSameWorkflow: false,
    },
  );

  assert.deepEqual({
    conclusion: 'bad',
    progress: 'in_progress',
  }, pick(report, ['conclusion', 'progress']));
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
    420000,
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
    summaries: [
      {
        acceptable: true,
        jobName: 'dprint',
        workflowPath: 'lint.yml',
      },
      {
        acceptable: true,
        jobName: 'typos',
        workflowPath: 'lint.yml',
      },
      {
        acceptable: true,
        jobName: 'judge-dependabot',
        workflowPath: 'merge-bot-pr.yml',
      },
      {
        acceptable: true,
        jobName: 'renovate',
        workflowPath: 'merge-bot-pr.yml',
      },
      {
        acceptable: true,
        jobName: 'selfup-runner',
        workflowPath: 'merge-bot-pr.yml',
      },
    ],
  }, {
    conclusion: 'acceptable',
    progress: 'done',
    summaries: report.summaries.map((summary) => pick(summary, ['workflowPath', 'jobName', 'acceptable'])),
  });
});
