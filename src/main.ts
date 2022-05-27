import { debug, info, getInput } from '@actions/core';
import { getOctokit, context } from '@actions/github';

import { Endpoints } from '@octokit/types';
import { exec as execExec } from '@actions/exec';
import { wait } from './wait';

// REST: https://docs.github.com/en/rest/checks/runs#list-check-runs-for-a-git-reference
// At 2022-05-27, GitHub does not provide this feature in their v4(GraphQL). So using v3(REST).
// Track the development status here https://github.community/t/graphql-check-runs/14449
const checkRunsRoute = 'GET /repos/{owner}/{repo}/commits/{ref}/check-runs' as const;
type CheckRunsRoute = typeof checkRunsRoute;
type CheckRunsResponse = Endpoints[CheckRunsRoute]['response'];
type CheckRunsParameters = Endpoints[CheckRunsRoute]['parameters'];

// REST: https://docs.github.com/en/rest/reference/actions#list-jobs-for-a-workflow-run
// GitHub does not provide to get job_id, we should get from the run_id https://github.com/actions/starter-workflows/issues/292#issuecomment-922372823
const listWorkflowRunsRoute = 'GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs' as const;
type ListWorkflowRunsRoute = typeof listWorkflowRunsRoute;
type ListWorkflowRunsResponse = Endpoints[ListWorkflowRunsRoute]['response'];

// type mergingStrategy = 'merge' | 'squash';

const githubToken = getInput('github-token', { required: true, trimWhitespace: false });
const mergingStrategy = getInput('merging-strategy', {
  required: true,
  trimWhitespace: true,
}).toLowerCase();

if (!(mergingStrategy === 'merge' || mergingStrategy === 'squash')) {
  throw Error(`given unknown merging-strategy: ${mergingStrategy}`);
}

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
  ownRunID: ListWorkflowRunsResponse['data']['jobs'][number]['id']
): Promise<OtherRunsStatus> {
  const listWorkflowRunsResp: ListWorkflowRunsResponse = await octokit.request(
    listWorkflowRunsRoute,
    {
      owner: params.owner,
      repo: params.repo,
      // eslint-disable-next-line camelcase
      run_id: ownRunID,
      // eslint-disable-next-line camelcase
      per_page: 4200, // Rough implementation to avoid pagination possibilities
      filter: 'latest',
    }
  );
  const ownJobIDs = listWorkflowRunsResp.data.jobs.map((job) => job.id);
  const checkRunsResp: CheckRunsResponse = await octokit.request(checkRunsRoute, {
    ...params,
    filter: 'latest',
  });
  debug(JSON.stringify(listWorkflowRunsResp.data.jobs));
  debug(JSON.stringify(checkRunsResp.data.check_runs));

  const otherRelatedRuns = checkRunsResp.data.check_runs.filter(
    (checkRun) => !ownJobIDs.includes(checkRun.id)
  );
  const otherRelatedCompletedRuns = otherRelatedRuns.filter(
    (checkRun) => checkRun.status === 'completed'
  );
  const runsSummary = otherRelatedRuns.map((checkRun) =>
    (({ id, status, conclusion }) => ({ id, status, conclusion }))(checkRun)
  );
  info(JSON.stringify({ ownRunID, ownJobIDs, ...runsSummary }));
  if (otherRelatedCompletedRuns.length === otherRelatedRuns.length) {
    return otherRelatedCompletedRuns.every((checkRun) => checkRun.conclusion === 'success')
      ? 'succeeded'
      : 'failed';
  }
  return 'in_progress';
}

// Taken from MDN
// The maximum is exclusive and the minimum is inclusive
function getRandomInt(min: number, max: number) {
  const flooredMin = Math.ceil(min);
  return Math.floor(Math.random() * (Math.floor(max) - flooredMin) + flooredMin);
}

async function run(): Promise<void> {
  const pr = context.payload.pull_request;

  if (!pr) {
    if (isDryRun) {
      return;
    }
    throw Error('this action should be ran on PR only');
  }

  let commitSha = 'provisional';
  const {
    repo: { repo, owner },
    payload: { pull_request: pullRequest },
    runId,
  } = context;
  if (pullRequest && 'head' in pullRequest) {
    const { head } = pullRequest;
    if (typeof head === 'object' && 'sha' in head) {
      commitSha = head.sha;
    } else {
      info(JSON.stringify(pullRequest));
      throw Error(
        'github context has unexpected format: missing context.payload.pull_request.head.sha'
      );
    }
  }

  const checkRunsParams: CheckRunsParameters = {
    owner,
    repo,
    // THis `ref` can't use context.ref and context.sha
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
    const jitterSeconds = getRandomInt(1, 7);
    // eslint-disable-next-line no-await-in-loop
    await wait((minIntervalSeconds * (2 ** attempts - 1) + jitterSeconds) * 1000);
    // eslint-disable-next-line no-await-in-loop
    otherBuildsProgress = await getOtherRunsStatus(checkRunsParams, runId);
    if (otherBuildsProgress === 'succeeded') {
      break;
    } else if (otherBuildsProgress === 'failed') {
      throw Error('some runs failed');
    }
  }

  await execExec(`gh pr review --approve "${pr.html_url}"`);
  await execExec(`gh pr merge --auto --${mergingStrategy} "${pr.html_url}"`);
}

run();
