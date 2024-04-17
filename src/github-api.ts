import { Octokit } from '@octokit/core';
import { paginateGraphQL } from '@octokit/plugin-paginate-graphql';
import { Commit } from '@octokit/graphql-schema';
import { Check, Trigger } from './schema.ts';

const PaginatableOctokit = Octokit.plugin(paginateGraphQL);

export async function fetchChecks(
  token: string,
  trigger: Trigger,
): Promise<Check[]> {
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
                  event
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

  return checkSuiteNodes.flatMap((checkSuite) => {
    const workflowRun = checkSuite.workflowRun;
    if (!workflowRun) {
      return [];
    }
    const workflow = workflowRun.workflow;

    const checkRuns = checkSuite?.checkRuns;
    if (!checkRuns) {
      throw new Error('no checkRuns');
    }

    if (checkRuns.totalCount > 100) {
      throw new Error('exceeded checkable runs limit');
    }

    const checkRunNodes = checkRuns.nodes?.flatMap((node) => node ? [node] : []);
    if (!checkRunNodes) {
      throw new Error('no runNodes');
    }

    return checkRunNodes.map((checkRun) => ({ checkRun, checkSuite, workflow, workflowRun }));
  });
}
