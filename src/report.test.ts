import test from 'node:test';
import assert from 'node:assert';
import { snapshot8679817057Checks } from './snapshot.ts';
import { generateReport } from './report.ts';
import { pick } from './util.ts';

test('wait-list', () => {
  const report = generateReport(
    snapshot8679817057Checks,
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

  assert.deepStrictEqual({
    conclusion: 'acceptable',
    progress: 'done',
    summaries: [
      {
        acceptable: true,
        checkRunUrl: 'https://github.com/kachick/wait-other-jobs/actions/runs/8679817058/job/23799347237',
        checkSuiteConclusion: 'SUCCESS',
        checkSuiteStatus: 'COMPLETED',
        isSameWorkflow: false,
        jobName: 'dprint',
        runConclusion: 'SUCCESS',
        runDatabaseId: 23799347237,
        runStatus: 'COMPLETED',
        workflowPath: 'lint.yml',
        eventName: 'pull_request',
      },
      {
        acceptable: true,
        checkRunUrl: 'https://github.com/kachick/wait-other-jobs/actions/runs/8679817058/job/23799347295',
        checkSuiteConclusion: 'SUCCESS',
        checkSuiteStatus: 'COMPLETED',
        isSameWorkflow: false,
        jobName: 'typos',
        runConclusion: 'SUCCESS',
        runDatabaseId: 23799347295,
        runStatus: 'COMPLETED',
        workflowPath: 'lint.yml',
        eventName: 'pull_request',
      },
      {
        acceptable: true,
        checkRunUrl: 'https://github.com/kachick/wait-other-jobs/actions/runs/8679817059/job/23799347394',
        checkSuiteConclusion: 'SKIPPED',
        checkSuiteStatus: 'COMPLETED',
        isSameWorkflow: false,
        jobName: 'dependabot',
        runConclusion: 'NEUTRAL',
        runDatabaseId: 23799347394,
        runStatus: 'COMPLETED',
        workflowPath: 'merge-bot-pr.yml',
        eventName: 'pull_request',
      },
    ],
  }, report);
});

test('skip-list', () => {
  const report = generateReport(
    snapshot8679817057Checks,
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
