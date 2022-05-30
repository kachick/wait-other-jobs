import { info, isDebug } from '@actions/core';
import type { getOctokit } from '@actions/github';
import type { Endpoints } from '@octokit/types';
import { debug } from 'console';

// No need to keep as same as GitHub responses so We can change the definition.
export type OtherRunsStatus = 'in_progress' | 'succeeded' | 'failed';

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
type CheckRunsSummary = Pick<
  CheckRunsResponse['data']['check_runs'][number],
  'id' | 'status' | 'conclusion' | 'started_at' | 'completed_at' | 'html_url' | 'name'
>;

export async function getJobIDs(
  octokit: Octokit,
  params: Pick<ListWorkflowRunsParams, 'owner' | 'repo' | 'run_id'>
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
      (resp) => resp.data.map((job) => job.id)
    )
  );
}

export async function getOtherRunsStatus(
  octokit: Octokit,
  params: Pick<CheckRunsParams, 'owner' | 'repo' | 'ref'>,
  ownJobIDs: Set<JobID>
): Promise<OtherRunsStatus> {
  const checkRunSummaries: CheckRunsSummary[] = await octokit.paginate(
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
        (({ id, status, conclusion, started_at, completed_at, html_url, name }) => ({
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
        }))(checkRun)
      )
  );
  if (isDebug()) {
    debug(JSON.stringify(checkRunSummaries, null, 2));
  }

  const otherRelatedRuns = checkRunSummaries.flatMap<CheckRunsSummary>((summary) =>
    ownJobIDs.has(summary.id) ? [] : [summary]
  );
  const otherRelatedCompletedRuns: typeof otherRelatedRuns = [];
  for (const summary of otherRelatedRuns) {
    if (summary.status === 'completed') {
      otherRelatedCompletedRuns.push(summary);
    } else {
      info(
        `${summary.id} - ${summary.status} - ${summary.conclusion}: ${summary.name} - ${summary.html_url}`
      );
    }
  }
  // Intentional use `>=` instead of `===` to prevent infinite loop
  if (otherRelatedCompletedRuns.length >= otherRelatedRuns.length) {
    return otherRelatedCompletedRuns.every(
      (summary) => summary.conclusion === 'success' || summary.conclusion === 'skipped'
    )
      ? 'succeeded'
      : 'failed';
  }
  return 'in_progress';
}
