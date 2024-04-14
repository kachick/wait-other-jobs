import { Octokit } from '@octokit/core';
import { paginateGraphQL } from '@octokit/plugin-paginate-graphql';
import { Commit } from '@octokit/graphql-schema';
import { join, relative } from 'path';
import { Summary, Trigger } from './schema.ts';

const PaginatableOctokit = Octokit.plugin(paginateGraphQL);

export async function fetchCheckRuns(
  token: string,
  trigger: Trigger,
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
      owner: trigger.owner,
      repo: trigger.repo,
      commitSha: trigger.ref,
    },
  );

  const checkSuiteNodes = checkSuites?.nodes?.flatMap((node) => node ? [node] : []);
  if (!checkSuiteNodes) {
    throw new Error('no checkSuiteNodes');
  }

  const summaries = checkSuiteNodes.flatMap((checkSuite) => {
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
      workflowPath: relative(`/${trigger.owner}/${trigger.repo}/actions/workflows/`, workflow.resourcePath),
      // Another file can set same workflow name. So you should filter workfrows from runId or the filename
      isSameWorkflow: checkSuite.workflowRun?.databaseId === trigger.runId,

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
