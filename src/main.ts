import { debug, info, getInput } from '@actions/core';
import { getOctokit, context } from '@actions/github';

import { Endpoints } from '@octokit/types';
import { exec as execExec } from '@actions/exec';
import { wait } from './wait';

// REST: https://docs.github.com/en/rest/checks/runs#list-check-runs-for-a-git-reference
// At 2022-05-25, GitHub does not private this feature in their v4(GraphQL). So using v3(REST).
// Track the development status here https://github.community/t/graphql-check-runs/14449
const checkRunsRoute = 'GET /repos/{owner}/{repo}/commits/{ref}/check-runs' as const;
type CheckRunsRoute = typeof checkRunsRoute;
type CheckRunsResponse = Endpoints[CheckRunsRoute]['response'];
type CheckRunsParameters = Endpoints[CheckRunsRoute]['parameters'];

const githubToken = getInput('github-token', { required: true });
const minIntervalSeconds = parseInt(getInput('min-interval-seconds', { required: true }), 10);

const octokit = getOctokit(githubToken);

async function checkAllBuildsPassed(params: CheckRunsParameters): Promise<boolean> {
  const resp: CheckRunsResponse = await octokit.request(checkRunsRoute, {
    ...params,
    filter: 'latest',
  });
  debug(JSON.stringify(resp.data.check_runs));

  // TODO: Remove before releasing v1
  info(JSON.stringify(resp.data.check_runs));
  const respAll: CheckRunsResponse = await octokit.request(checkRunsRoute, {
    ...params,
    filter: 'all',
  });
  debug(JSON.stringify(respAll.data.check_runs));
  info(JSON.stringify(respAll.data.check_runs));

  return resp.data.check_runs.every(
    (checkRun) => checkRun.status === 'completed' && checkRun.conclusion === 'success'
  );
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
    throw Error('this action should be ran on PR only');
  }

  const {
    ref,
    repo: { repo, owner },
  } = context;

  const checkRunsParams: CheckRunsParameters = {
    owner,
    repo,
    ref,
  };

  // "Exponential backoff and jitter"
  let retries = 0;
  // eslint-disable-next-line no-await-in-loop
  while (!(await checkAllBuildsPassed(checkRunsParams))) {
    const jitterSeconds = getRandomInt(1, 7);
    // eslint-disable-next-line no-await-in-loop
    await wait((minIntervalSeconds ** retries + jitterSeconds) * 1000);
    retries += 1;
  }

  await execExec(`gh pr review --approve "${pr.html_url}"`);
  await execExec(`gh pr merge --auto --merge "${pr.html_url}"`);
}

run();
