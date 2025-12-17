import assert from 'node:assert';
import { describe, it } from 'node:test';
import { Temporal } from 'temporal-polyfill';
import { generateReport, getSummaries, type PollingReport, readableDuration, type Summary } from '../src/report.ts';
import { omit } from '../src/util.ts';
import { jsonEqual } from './assert.ts';
import { checks8679817057, checks92810686811WaitSuccessPolling1 } from './fixtures/snapshot.ts'; // 'undefined/workflow'` came from old snapshots

describe('readableDuration', () => {
  it('formats duration in various units', () => {
    assert.strictEqual(
      readableDuration(Temporal.Duration.from({ milliseconds: 454356 })),
      'about 7 minutes 34 seconds',
    );
    assert.strictEqual(readableDuration(Temporal.Duration.from({ milliseconds: 32100 })), 'about 32 seconds');
    assert.strictEqual(
      readableDuration(Temporal.Duration.from({ hours: 4, minutes: 100, seconds: 79 })),
      'about 5 hours 41 minutes 19 seconds',
    );
  });
});

const exampleSummary = Object.freeze(
  {
    isAcceptable: false,
    isCompleted: false,
    workflowPermalink: 'https://github.example.com/repo/owner/actions/runs/workflow_run_id/workflow',
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

    format: () => '',
  } as const satisfies Summary,
);

describe('generateReport with wait-list', () => {
  it('reports done when required jobs are met', () => {
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
        isSkipSameWorkflowEnabled: false,
      },
    );

    assert.deepStrictEqual(omit<PollingReport, 'summaries'>(report, ['summaries']), {
      done: true,
      logs: [],
      ok: true,
    });
  });

  it('matches jobs by prefix when specified', () => {
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
        isSkipSameWorkflowEnabled: false,
      },
    );

    jsonEqual(omit<PollingReport, 'summaries'>(report, ['summaries']), {
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
              workflowPermalink: 'https://github.example.com/repo/owner/actions/runs/workflow_run_id/workflow',
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
              workflowPermalink: 'https://github.example.com/repo/owner/actions/runs/workflow_run_id/workflow',
            },
          ],
          severity: 'info',
        },
      ],
      ok: true,
    });
  });

  describe('with startupGracePeriod', () => {
    const trigger = Object.freeze({
      owner: 'kachick',
      repo: 'wait-other-jobs',
      'runId': 92810686811,
      ref: '8c14d2a44d6dff4e69b0a3cacc2a14e416b44137',
      jobId: 'wait-success',
      eventName: 'pull_request',
    });
    it('waits for a slow-starting job if within its grace period', () => {
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
          isSkipSameWorkflowEnabled: false,
        },
      );

      jsonEqual(
        omit<PollingReport, 'summaries'>(report, ['summaries']),
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
                  workflowPermalink: 'undefined/workflow',
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
                  startupGracePeriod: Temporal.Duration.from('PT60S'),
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

    it('fails if a slow-starting job exceeds its grace period', () => {
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
          isSkipSameWorkflowEnabled: false,
        },
      );

      jsonEqual(omit<PollingReport, 'summaries'>(report, ['summaries']), {
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
                workflowPermalink: 'undefined/workflow',
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

    it('fails if a slow-starting job has the same duration as the grace period', () => {
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
          isSkipSameWorkflowEnabled: false,
        },
      );

      jsonEqual(omit<PollingReport, 'summaries'>(report, ['summaries']), {
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
                workflowPermalink: 'undefined/workflow',
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

    it('reports failure for completed failing jobs even with pending jobs', () => {
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
          isSkipSameWorkflowEnabled: false,
        },
      );

      jsonEqual(omit<PollingReport, 'summaries'>(report, ['summaries']), {
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
                workflowPermalink: 'https://github.example.com/repo/owner/actions/runs/workflow_run_id/workflow',
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
                startupGracePeriod: Temporal.Duration.from('PT5M'),
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

describe('generateReport with skip-list', () => {
  it('ignores jobs specified in the skip list', () => {
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
            'workflowFile': 'merge-bot-pr.yml',
            'jobName': 'dependabot',
            jobMatchMode: 'exact',
          },
        ],
        isSkipSameWorkflowEnabled: false,
      },
    );

    assert.deepStrictEqual(omit<PollingReport, 'summaries'>(exactReport, ['summaries']), {
      done: true,
      logs: [],
      ok: true,
    });
  });

  it('ignores jobs by prefix when specified', () => {
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
        isSkipSameWorkflowEnabled: false,
      },
    );

    jsonEqual(omit<PollingReport, 'summaries'>(report, ['summaries']), {
      done: true,
      logs: [],
      ok: true,
    });
  });
});
