import { Octokit } from '@octokit/core';
import { paginateGraphQL } from '@octokit/plugin-paginate-graphql';
import { CheckSuite, Workflow, CheckRun, Commit } from '@octokit/graphql-schema';
import { join, relative } from 'path';
import { z } from 'zod';
import { debug, isDebug } from '@actions/core';

const PaginatableOctokit = Octokit.plugin(paginateGraphQL);

const ListItem = z.object({
  workflowFile: z.string().endsWith('.yml'),
  jobName: (z.string().min(1)).optional(),
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

export async function getCheckRunSummaries(
  token: string,
  params: { owner: string; repo: string; ref: string },
): Promise<Array<Summary>> {
  const octokit = new PaginatableOctokit({ auth: token });
  const { repository: { object: { checkSuites } } } = await octokit.graphql.paginate<
    { repository: { object: { checkSuites: Commit['checkSuites'] } } }
  >(
    `
    query GetCheckRuns($owner: String!, $repo: String!, $commitSha: String!, $cursor: String) {
      repository(owner: $owner, name: $repo) {
        object(expression: $commitSha) {
          ... on Commit {
            checkSuites(first: 100, after: $cursor) {
              totalCount
              pageInfo {
                hasNextPage
                endCursor
              }
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
                  totalCount
                  pageInfo {
                    hasNextPage
                    endCursor
                  }
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
    throw new Error('no checkSuiteNodes');
  }

  const summaries = checkSuiteNodes.flatMap((checkSuite) => {
    if (isDebug()) {
      debug(JSON.stringify(checkSuite));
    }
    const workflow = checkSuite.workflowRun?.workflow;
    if (!workflow) {
      return [];
    }

    const checkRuns = checkSuite?.checkRuns;
    if (!checkRuns) {
      throw new Error('no checkRuns');
    }

    if (checkRuns.totalCount > 100) {
      throw new Error('exceeded checkable runs limit');
    }

    const runNodes = checkRuns.nodes?.flatMap((node) => node ? [node] : []);
    if (!runNodes) {
      throw new Error('no runNodes');
    }

    return runNodes.map((run) => ({
      acceptable: run.conclusion == 'SUCCESS' || run.conclusion === 'SKIPPED'
        || (run.conclusion === 'NEUTRAL'
          && (checkSuite.conclusion === 'SUCCESS' || checkSuite.conclusion === 'SKIPPED')),
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

// No need to keep as same as GitHub responses so We can change the definition.
interface Report {
  progress: 'in_progress' | 'done';
  conclusion: 'acceptable' | 'bad';
  summaries: Summary[];
}

export async function fetchOtherRunStatus(
  token: string,
  params: Parameters<typeof getCheckRunSummaries>[1],
  trigger: { workflowName: string; jobName: string },
  waitList: z.infer<typeof List>,
  skipList: z.infer<typeof List>,
): Promise<Report> {
  if (waitList.length > 0 && skipList.length > 0) {
    throw new Error('Do not specify both wait-list and skip-list');
  }

  const checkRunSummaries = await getCheckRunSummaries(token, params);
  const otherRunSummaries = checkRunSummaries.filter((summary) =>
    !(summary.workflowName === trigger.workflowName && summary.jobName === trigger.jobName)
  );
  if (otherRunSummaries.length === 0) {
    throw new Error('No check runs found except wait-other-jobs itself');
  }

  let filteredSummraries = otherRunSummaries;

  if (waitList.length > 0) {
    filteredSummraries = filteredSummraries.filter((summary) =>
      waitList.some((target) =>
        target.workflowFile === summary.workflowPath && (target.jobName ? (target.jobName === summary.jobName) : true)
      )
    );
  }
  if (skipList.length > 0) {
    filteredSummraries = filteredSummraries.filter((summary) =>
      !skipList.some((target) =>
        target.workflowFile === summary.workflowPath && (target.jobName ? (target.jobName === summary.jobName) : true)
      )
    );
  }

  const completedRuns = filteredSummraries.filter((summary) => summary.runStatus === 'COMPLETED');

  const progress: Report['progress'] = completedRuns.length === filteredSummraries.length
    ? 'done'
    : 'in_progress';
  const conclusion: Report['conclusion'] = completedRuns.every((summary) => summary.acceptable)
    ? 'acceptable'
    : 'bad';

  return { progress, conclusion, summaries: filteredSummraries };
}
