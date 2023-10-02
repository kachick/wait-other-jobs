import type { getOctokit } from '@actions/github';
import schema from '@octokit/graphql-schema';
import { error } from '@actions/core';
import { join, relative } from 'path';

interface Summary {
  acceptable: boolean; // Set by us
  workflowPath: string; // Set by us

  checkSuiteStatus: schema.CheckSuite['status'];
  checkSuiteConclusion: schema.CheckSuite['conclusion'];

  workflowName: schema.Workflow['name'];

  runDatabaseId: schema.CheckRun['databaseId'];
  jobName: schema.CheckRun['name'];
  checkRunUrl: schema.CheckRun['detailsUrl'];
  runStatus: schema.CheckRun['status'];
  runConclusion: schema.CheckRun['conclusion']; // null if status is in progress
}

export async function getCheckRunSummaries(
  octokit: Octokit,
  params: { owner: string; repo: string; ref: string; triggerRunId: number },
): Promise<Array<Summary>> {
  const { repository: { object: { checkSuites } } } = await octokit.graphql<
    { repository: { object: { checkSuites: schema.Commit['checkSuites'] } } }
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
): Promise<Report> {
  const checkRunSummaries = await getCheckRunSummaries(octokit, params);
  const completedRuns = checkRunSummaries.filter((summary) => summary.runStatus === 'COMPLETED');

  const progress: Report['progress'] = completedRuns.length === checkRunSummaries.length
    ? 'done'
    : 'in_progress';
  const conclusion: Report['conclusion'] = completedRuns.every((summary) => summary.acceptable)
    ? 'acceptable'
    : 'bad';

  return { progress, conclusion, summaries: checkRunSummaries };
}
