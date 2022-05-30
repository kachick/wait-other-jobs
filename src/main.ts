import { debug, info, getInput } from '@actions/core';
import { getOctokit, context } from '@actions/github';

import { Endpoints } from '@octokit/types';

import { calculateIntervalMilliseconds, wait } from './wait';

// REST: https://docs.github.com/en/rest/checks/runs#list-check-runs-for-a-git-reference
// At 2022-05-27, GitHub does not provide this feature in their v4(GraphQL). So using v3(REST).
// Track the development status here https://github.community/t/graphql-check-runs/14449
const checkRunsRoute = 'GET /repos/{owner}/{repo}/commits/{ref}/check-runs' as const;
type CheckRunsRoute = typeof checkRunsRoute;
type CheckRunsParameters = Endpoints[CheckRunsRoute]['parameters'];

// REST: https://docs.github.com/en/rest/reference/actions#list-jobs-for-a-workflow-run
// GitHub does not provide to get job_id, we should get from the run_id https://github.com/actions/starter-workflows/issues/292#issuecomment-922372823
const listWorkflowRunsRoute = 'GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs' as const;
type ListWorkflowRunsRoute = typeof listWorkflowRunsRoute;
type ListWorkflowRunsParams = Endpoints[ListWorkflowRunsRoute]['parameters'];

const githubToken = getInput('github-token', { required: true, trimWhitespace: false });

const minIntervalSeconds = parseInt(
  getInput('min-interval-seconds', { required: true, trimWhitespace: true }),
  10
);
const isDryRun =
  getInput('dry-run', { required: true, trimWhitespace: true }).toLowerCase() === 'true';

const octokit = getOctokit(githubToken);

type OtherRunsStatus = 'in_progress' | 'succeeded' | 'failed';
async function getOtherRunsStatus(
  params: CheckRunsParameters,
  ownRunID: ListWorkflowRunsParams['run_id']
): Promise<OtherRunsStatus> {
  const ownJobIDs = new Set(
    await octokit.paginate(
      octokit.rest.actions.listJobsForWorkflowRun,
      {
        owner: params.owner,
        repo: params.repo,
        // eslint-disable-next-line camelcase
        run_id: ownRunID,
        // eslint-disable-next-line camelcase
        per_page: 100,
        filter: 'latest',
      },
      (resp) => resp.data.map((job) => job.id)
    )
  );
  const checkRunSummaries = await octokit.paginate(
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

  const otherRelatedRuns = checkRunSummaries.filter((summary) => !ownJobIDs.has(summary.id));
  const otherRelatedCompletedRuns: typeof otherRelatedRuns = [];
  // const otherRelatedCompletedRuns = otherRelatedRuns.filter(
  //   (summary) => summary.status === 'completed'
  // );
  info(JSON.stringify({ ownRunID, ownJobIDs: [...ownJobIDs], checkRunSummaries }, null, 2));
  // eslint-disable-next-line no-restricted-syntax
  for (const summary of otherRelatedRuns) {
    if (summary.status === 'completed') {
      otherRelatedCompletedRuns.push(summary);
    } else {
      info(`${summary.name} - ${summary.id}: ${summary.html_url}`);
    }
  }
  if (otherRelatedCompletedRuns.length === otherRelatedRuns.length) {
    return otherRelatedCompletedRuns.every(
      (summary) => summary.conclusion === 'success' || summary.conclusion === 'skipped'
    )
      ? 'succeeded'
      : 'failed';
  }
  return 'in_progress';
}

async function run(): Promise<void> {
  const {
    repo: { repo, owner },
    payload,
    runId,
    sha,
  } = context;
  const pr = payload.pull_request;
  let commitSha = sha;
  if (pr && 'head' in pr) {
    const { head } = pr;
    if (typeof head === 'object' && 'sha' in head) {
      commitSha = head.sha;
    } else {
      debug(JSON.stringify(pr, null, 2));
      throw Error(
        'github context has unexpected format: missing context.payload.pull_request.head.sha'
      );
    }
  }

  const checkRunsParams: CheckRunsParameters = {
    owner,
    repo,
    ref: commitSha,
  };

  if (isDryRun) {
    return;
  }

  // "Exponential backoff and jitter"
  let attempts = 0;
  let otherBuildsProgress: OtherRunsStatus = 'in_progress';

  for (;;) {
    attempts += 1;
    // eslint-disable-next-line no-await-in-loop
    await wait(calculateIntervalMilliseconds(minIntervalSeconds, attempts));
    // eslint-disable-next-line no-await-in-loop
    otherBuildsProgress = await getOtherRunsStatus(checkRunsParams, runId);
    if (otherBuildsProgress === 'succeeded') {
      info('all jobs passed');
      break;
    } else if (otherBuildsProgress === 'failed') {
      info('some jobs failed');
      process.exit(1);
    } else {
      info(`some jobs still in progress: ${attempts} times checked`);
    }
  }
}

run();
