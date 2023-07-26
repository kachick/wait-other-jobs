import type { getOctokit } from '@actions/github';
import type { Endpoints } from '@octokit/types';

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

async function fetchRunSummaries(
  octokit: Octokit,
  params: Readonly<Pick<CheckRunsParams, 'owner' | 'repo' | 'ref'>>,
): Promise<CheckRunsSummary[]> {
  return await octokit.paginate(
    octokit.rest.checks.listForRef,
    {
      ...params,
      per_page: 100,
      filter: 'latest',
    },
    (resp) =>
      resp.data.map((checkRun) =>
        (({ id, status, conclusion, started_at, completed_at, html_url, name }) => ({
          source: {
            id,
            status,
            conclusion,
            started_at,
            completed_at,
            html_url,
            name,
          },
          acceptable: isAcceptable(conclusion),
        }))(checkRun)
      ).sort((a, b) => a.source.id - b.source.id),
  );
}

export async function fetchOtherRunStatus(
  octokit: Parameters<typeof fetchRunSummaries>[0],
  params: Parameters<typeof fetchRunSummaries>[1],
  ownJobIDs: Readonly<Set<JobID>>,
): Promise<Report> {
  const checkRunSummaries = await fetchRunSummaries(octokit, params);
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
