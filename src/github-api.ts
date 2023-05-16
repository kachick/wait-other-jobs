import { info } from '@actions/core';
import type { getOctokit } from '@actions/github';
import type { Endpoints } from '@octokit/types';
import { graphql } from '@octokit/graphql';

type Octokit = ReturnType<typeof getOctokit>;

// REST: https://docs.github.com/en/rest/reference/actions#list-jobs-for-a-workflow-run
// GitHub does not provide to get job_id, we should get from the run_id https://github.com/actions/starter-workflows/issues/292#issuecomment-922372823
const listWorkflowRunsRoute = 'GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs' as const;
type ListWorkflowRunsRoute = typeof listWorkflowRunsRoute;
type ListWorkflowRunsResponse = Endpoints[ListWorkflowRunsRoute]['response'];
type ListWorkflowRunsParams = Endpoints[ListWorkflowRunsRoute]['parameters'];

type JobID = ListWorkflowRunsResponse['data']['jobs'][number]['id'];

// REST: https://docs.github.com/en/rest/checks/runs#list-check-runs-for-a-git-reference
// At 2022-05-27, GitHub does not provide this feature in their v4(GraphQL). So using v3(REST).
// Track the development status here https://github.community/t/graphql-check-runs/14449
const checkRunsRoute = 'GET /repos/{owner}/{repo}/commits/{ref}/check-runs' as const;
type CheckRunsRoute = typeof checkRunsRoute;
type CheckRunsParams = Endpoints[CheckRunsRoute]['parameters'];
type CheckRunsResponse = Endpoints[CheckRunsRoute]['response'];
type CheckRunsSummarySource = Pick<
  CheckRunsResponse['data']['check_runs'][number],
  'id' | 'status' | 'conclusion' | 'started_at' | 'completed_at' | 'html_url' | 'name'
>;
interface CheckRunsSummary {
  source: CheckRunsSummarySource;
  acceptable: boolean;
}

// No need to keep as same as GitHub responses so We can change the definition.
interface Report {
  progress: 'in_progress' | 'done';
  conclusion: 'acceptable' | 'bad';
  summaries: CheckRunsSummary[];
}

function isAcceptable(conclusion: CheckRunsSummarySource['conclusion']): boolean {
  return conclusion === 'success' || conclusion === 'skipped';
}

export async function fetchJobIDs(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  octokit: Octokit,
  params: Readonly<Pick<ListWorkflowRunsParams, 'owner' | 'repo' | 'run_id'>>,
): Promise<Set<JobID>> {
  return new Set(
    await octokit.paginate(
      octokit.rest.actions.listJobsForWorkflowRun,
      {
        ...params,
        // eslint-disable-next-line camelcase
        per_page: 100,
        filter: 'latest',
      },
      (resp) =>
        resp.data.map((job) => {
          info(JSON.stringify({ 'debugLog_For#474-listJobsForWorkflowRun': job }));
          return job.id;
        }),
    ),
  );
}

async function fetchRunSummaries(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  octokit: Octokit,
  params: Readonly<Pick<CheckRunsParams, 'owner' | 'repo' | 'ref'>>,
): Promise<CheckRunsSummary[]> {
  return await octokit.paginate(
    octokit.rest.checks.listForRef,
    {
      ...params,
      // eslint-disable-next-line camelcase
      per_page: 100,
      filter: 'latest',
    },
    (resp) =>
      resp.data.map((checkRun) =>
        // eslint-disable-next-line camelcase
        (({ id, status, conclusion, started_at, completed_at, html_url, name, ...others }) => ({
          source: {
            id,
            status,
            conclusion,
            // eslint-disable-next-line camelcase
            started_at,
            // eslint-disable-next-line camelcase
            completed_at,
            // eslint-disable-next-line camelcase
            html_url,
            name,
            others,
          },
          acceptable: isAcceptable(conclusion),
        }))(checkRun)
      ).sort((a, b) => a.source.id - b.source.id),
  );
}

export async function fetchRunSummaries2(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  token: string,
  params: Readonly<Pick<CheckRunsParams, 'owner' | 'repo' | 'ref'>>,
): Promise<unknown> {
  const graphqlWithAuth = graphql.defaults({
    headers: {
      authorization: token,
    },
  });

  const bar = await graphqlWithAuth<{ foo: string }>(
    `query GetCheckRuns($owner: String!, $repo: String!, $commitSha: String!) {
      repository(owner: $owner, name: $repo) {
        object(expression: $commitSha) {
          ... on Commit {
            checkSuites(first: 10) {
              edges {
                node {
                  id
                  status
                  conclusion
                  workflowRun {
                    id
                    databaseId
                    createdAt
                    workflow {
                      id
                      databaseId
                      name
                      resourcePath
                      url
                    }
                  }
                  checkRuns(first: 10) {
                    edges {
                      node {
                        id
                        databaseId
                        name
                        status
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
    }`,
    {
      owner: params.owner || 'kachick',
      repo: params.repo || 'wait-other-jobs',
      commitSha: params.ref || '4686c4074b62976294e65cd06eafd7429784ff02',
    },
  );
  return bar;
}

export async function fetchOtherRunStatus(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  octokit: Parameters<typeof fetchRunSummaries>[0],
  params: Parameters<typeof fetchRunSummaries>[1],
  ownJobIDs: Readonly<Set<JobID>>,
): Promise<Report> {
  const checkRunSummaries = await fetchRunSummaries(octokit, params);
  info(JSON.stringify({ 'debugLog_For#474-checkRunSummaries': checkRunSummaries }));
  const otherRelatedRuns = checkRunSummaries.flatMap<CheckRunsSummary>((summary) =>
    ownJobIDs.has(summary.source.id) ? [] : [summary]
  );
  const otherRelatedCompletedRuns = otherRelatedRuns.filter((summary) => summary.source.status === 'completed');

  const progress: Report['progress'] = otherRelatedCompletedRuns.length === otherRelatedRuns.length
    ? 'done'
    : 'in_progress';
  const conclusion: Report['conclusion'] = otherRelatedCompletedRuns.every((summary) => summary.acceptable)
    ? 'acceptable'
    : 'bad';

  return { progress, conclusion, summaries: otherRelatedRuns };
}
