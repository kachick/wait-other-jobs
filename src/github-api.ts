import type { getOctokit } from '@actions/github';
import { CheckSuite, Workflow, CheckRun, Commit } from '@octokit/graphql-schema';
import { error } from '@actions/core';
import { join, relative } from 'path';
import { z } from 'zod';

const ListItem = z.object({
  workflowFile: z.string().endsWith('.yml'),
  jobName: z.string().min(1),
});
export const List = z.array(ListItem);

interface Summary {
  acceptable: boolean; // Set by us
  workflowPath: string; // Set by us

  checkSuiteStatus: CheckSuite['status'];
  checkSuiteConclusion: CheckSuite['conclusion'];

  workflowName: Workflow['name'];

  runDatabaseId: CheckRun['databaseId'];
  jobName: CheckRun['name'];
  checkRunUrl: CheckRun['detailsUrl'];
  runStatus: CheckRun['status'];
  runConclusion: CheckRun['conclusion']; // null if status is in progress
}

// Currently no paging is considered for my usecase
// If needed to cover long list > 100, consider one of follows
// - Paging with https://github.com/octokit/plugin-paginate-graphql.js
// - Filtering in GraphQL query layer with wait only list. This changes current reporting behaviors to omit finished jobs
export async function getCheckRunSummaries(
  octokit: Octokit,
  params: { owner: string; repo: string; ref: string; triggerRunId: number },
): Promise<Array<Summary>> {
  const { repository: { object: { checkSuites } } } = await octokit.graphql<
    { repository: { object: { checkSuites: Commit['checkSuites'] } } }
  >(
    `
    query GetCheckRuns($owner: String!, $repo: String!, $commitSha: String!) {
      repository(owner: $owner, name: $repo) {
        object(expression: $commitSha) {
          ... on Commit {
            checkSuites(first: 100) {
              nodes {
                status
                conclusion
                workflowRun {
                  databaseId
                  workflow {
                    name
                    resourcePath
                  }
                }
                checkRuns(first: 100) {
                  nodes {
                    databaseId
                    name
                    status
                    detailsUrl
                    conclusion
                  }
                }
              }
            }
          }
        }
      }
    }
  `,
    {
      owner: params.owner,
      repo: params.repo,
      commitSha: params.ref,
    },
  );

  const checkSuiteNodes = checkSuites?.nodes?.flatMap((node) => node ? [node] : []);
  if (!checkSuiteNodes) {
    error('Cannot correctly get via GraphQL');
    throw new Error('no checkSuiteNodes');
  }

  const summaries = checkSuiteNodes.flatMap((checkSuite) => {
    const workflow = checkSuite.workflowRun?.workflow;
    if (!workflow) {
      return [];
    }

    if (checkSuite.workflowRun?.databaseId === params.triggerRunId) {
      return [];
    }

    const runNodes = checkSuite?.checkRuns?.nodes?.flatMap((node) => node ? [node] : []);
    if (!runNodes) {
      error('Cannot correctly get via GraphQL');
      throw new Error('no runNodes');
    }

    return runNodes.map((run) => ({
      acceptable: run.conclusion == 'SUCCESS' || run.conclusion === 'SKIPPED' || checkSuite.conclusion === 'SKIPPED',
      workflowPath: relative(`/${params.owner}/${params.repo}/actions/workflows/`, workflow.resourcePath),

      checkSuiteStatus: checkSuite.status,
      checkSuiteConclusion: checkSuite.conclusion,

      runDatabaseId: run.databaseId,
      workflowName: workflow.name,
      jobName: run.name,
      checkRunUrl: run.detailsUrl,
      runStatus: run.status,
      runConclusion: run.conclusion,
    }));
  });

  return summaries.toSorted((a, b) => join(a.workflowPath, a.jobName).localeCompare(join(b.workflowPath, b.jobName)));
}

type Octokit = ReturnType<typeof getOctokit>;

// No need to keep as same as GitHub responses so We can change the definition.
interface Report {
  progress: 'in_progress' | 'done';
  conclusion: 'acceptable' | 'bad';
  summaries: Summary[];
}

export async function fetchOtherRunStatus(
  octokit: Parameters<typeof getCheckRunSummaries>[0],
  params: Parameters<typeof getCheckRunSummaries>[1],
  waitList: z.infer<typeof List>,
  skipList: z.infer<typeof List>,
): Promise<Report> {
  if (waitList.length > 0 && skipList.length > 0) {
    throw new Error('Do not specify both wait-list and skip-list');
  }

  let checkRunSummaries = await getCheckRunSummaries(octokit, params);

  const getComparePath = (item: z.infer<typeof ListItem>) => (`${item.workflowFile}/${item.jobName}`);
  if (waitList.length > 0) {
    const waitPathSet = new Set(waitList.map(getComparePath));
    checkRunSummaries = checkRunSummaries.filter((summary) =>
      waitPathSet.has(getComparePath({ workflowFile: summary.workflowPath, jobName: summary.jobName }))
    );
  }
  if (skipList.length > 0) {
    const skipPathSet = new Set(skipList.map(getComparePath));
    checkRunSummaries = checkRunSummaries.filter((summary) =>
      !skipPathSet.has(getComparePath({ workflowFile: summary.workflowPath, jobName: summary.jobName }))
    );
  }

  const completedRuns = checkRunSummaries.filter((summary) => summary.runStatus === 'COMPLETED');

  const progress: Report['progress'] = completedRuns.length === checkRunSummaries.length
    ? 'done'
    : 'in_progress';
  const conclusion: Report['conclusion'] = completedRuns.every((summary) => summary.acceptable)
    ? 'acceptable'
    : 'bad';

  return { progress, conclusion, summaries: checkRunSummaries };
}
