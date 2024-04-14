import test from 'node:test';
import assert from 'node:assert';
import { snapshotChecks } from './snapshot.ts';
import { generateReport } from './report.ts';

// https://stackoverflow.com/a/56162151
function pick<T extends object, U extends keyof T>(
  obj: T,
  paths: Array<U>,
): Pick<T, U> {
  const ret = Object.create({});
  for (const k of paths) {
    ret[k] = obj[k];
  }
  return ret;
}

test('wait-list', () => {
  const report = generateReport(
    snapshotChecks,
    {
      owner: 'kachick',
      repo: 'wait-other-jobs',
      'runId': 8679817057,
      ref: '760074f4f419b55cb864030c29ece58a689a42a2',
      jobName: 'wait-list',
    },
    {
      waitList: [
        {
          'workflowFile': 'lint.yml',
          'optional': false,
        },
        {
          'workflowFile': 'merge-bot-pr.yml',
          'jobName': 'dependabot',
          'optional': true,
        },
        {
          'workflowFile': 'THERE_ARE_NO_FILES_AS_THIS.yml',
          'optional': true,
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
      },
    ],
  }, report);
});

test('skip-list', () => {
  const report = generateReport(
    snapshotChecks,
    {
      owner: 'kachick',
      repo: 'wait-other-jobs',
      'runId': 8679817057,
      ref: '760074f4f419b55cb864030c29ece58a689a42a2',
      jobName: 'skip-list',
    },
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
