import type { getOctokit } from '@actions/github';
import type { Endpoints } from '@octokit/types';

// import { graphql } from '@octokit/graphql';
import schema from '@octokit/graphql-schema';
import { error } from '@actions/core';
import { relative } from 'path';

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
  params: { 'owner': string; 'repo': string; ref: string },
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
              edges {
                node {
                  status
                  conclusion
                  workflowRun {
                    createdAt
                    workflow {
                      databaseId
                      name
                      resourcePath
                      url
                    }
                  }
                  checkRuns(first: 100) {
                    edges {
                      node {
                        databaseId
                        name
                        status
                      	detailsUrl
                        conclusion
                        startedAt
                        completedAt
                      }
                    }
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

  // const getNodes = (maybe: schema.Maybe<unknown>) => {
  //   const edges = maybe?.edges;
  // }

  const edges = checkSuites?.edges;

  if (!edges) {
    error('Cannot correctly get via GraphQL');
    throw new Error('no edges');
  }
  const checkSuiteNodes = edges.flatMap((edge) => {
    const node = edge?.node;
    return node ? [node] : [];
  });

  // const runIdToSummary = new Map<schema.CheckRun['id'], Summary>();

  const summaries = checkSuiteNodes.flatMap((checkSuite) => {
    const workflow = checkSuite.workflowRun?.workflow;
    if (!workflow) {
      return [];
    }
    const runEdges = checkSuite.checkRuns?.edges;
    if (!runEdges) {
      error('Cannot correctly get via GraphQL');
      throw new Error('no edges');
    }
    const runs = runEdges.flatMap((edge) => {
      const node = edge?.node;
      return node ? [node] : [];
    });

    return runs.map((run) => ({
      acceptable: run.conclusion == 'SUCCESS' || run.conclusion == 'SKIPPED',
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

  return summaries.toSorted((a, b) => a.workflowPath.localeCompare(b.workflowPath));

  // for (const checkSuite of checkSuiteNodes) {
  //   const workflow = checkSuite.workflowRun?.workflow;
  //   if (!workflow) {
  //     info('skip', checkSuite);
  //     continue;
  //   }
  //   const runEdges = checkSuite.checkRuns?.edges;
  //   if (!runEdges) {
  //     error('Cannot correctly get via GraphQL');
  //     throw new Error('no edges');
  //   }
  //   const runs = runEdges.flatMap((edge) => {
  //     const node = edge?.node;
  //     return node ? [node] : [];
  //   });
  //   for (const run of runs) {
  //     runIdToSummary.set(run.id, {
  //       acceptable: run.conclusion == 'SUCCESS' || run.conclusion == 'SKIPPED',
  //       workflowPath: relative(`/${params.owner}/${params.repo}/actions/workflows/`, workflow.resourcePath),

  //       workflowName: workflow.name,
  //       jobName: run.name,
  //       checkRunUrl: run.detailsUrl,
  //       status: run.status,
  //       conclusion: run.conclusion,
  //     });
  //   }
  // }

  // return runIdToSummary;
}

type Octokit = ReturnType<typeof getOctokit>;

// REST: https://docs.github.com/en/rest/reference/actions#list-jobs-for-a-workflow-run
// GitHub does not provide to get job_id, we should get from the run_id https://github.com/actions/starter-workflows/issues/292#issuecomment-922372823
const listWorkflowRunsRoute = 'GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs' as const;
type ListWorkflowRunsRoute = typeof listWorkflowRunsRoute;
type ListWorkflowRunsResponse = Endpoints[ListWorkflowRunsRoute]['response'];
type ListWorkflowRunsParams = Endpoints[ListWorkflowRunsRoute]['parameters'];

type JobID = ListWorkflowRunsResponse['data']['jobs'][number]['id'];

// No need to keep as same as GitHub responses so We can change the definition.
interface Report {
  progress: 'in_progress' | 'done';
  conclusion: 'acceptable' | 'bad';
  summaries: Summary[];
}

export async function fetchJobIDs(
  octokit: Octokit,
  params: Readonly<Pick<ListWorkflowRunsParams, 'owner' | 'repo' | 'run_id'>>,
): Promise<Set<JobID>> {
  return new Set(
    await octokit.paginate(
      octokit.rest.actions.listJobsForWorkflowRun,
      {
        ...params,
        per_page: 100,
        filter: 'latest',
      },
      (resp) => resp.data.map((job) => job.id),
    ),
  );
}

export async function fetchOtherRunStatus(
  octokit: Parameters<typeof getCheckRunSummaries>[0],
  params: Parameters<typeof getCheckRunSummaries>[1],
  ownJobIDs: Readonly<Set<JobID>>,
): Promise<Report> {
  const checkRunSummaries = await getCheckRunSummaries(octokit, params);
  const otherRelatedRuns = checkRunSummaries.flatMap((summary) =>
    summary.runDatabaseId ? (ownJobIDs.has(summary.runDatabaseId) ? [] : [summary]) : []
  );
  const otherRelatedCompletedRuns = otherRelatedRuns.filter((summary) => summary.runStatus === 'COMPLETED');

  const progress: Report['progress'] = otherRelatedCompletedRuns.length === otherRelatedRuns.length
    ? 'done'
    : 'in_progress';
  const conclusion: Report['conclusion'] = otherRelatedCompletedRuns.every((summary) => summary.acceptable)
    ? 'acceptable'
    : 'bad';

  return { progress, conclusion, summaries: otherRelatedRuns };
}
