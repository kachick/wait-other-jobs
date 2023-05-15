/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "query GetCheckRuns($commitSha: String!) {\n  repository(owner: \"kachick\", name: \"wait-other-jobs\") {\n    object(expression: $commitSha) {\n      ... on Commit {\n        checkSuites(first: 10) {\n          edges {\n            node {\n              id\n              status\n              conclusion\n              workflowRun {\n                id\n                databaseId\n                createdAt\n                workflow {\n                  id\n                  databaseId\n                  name\n                  resourcePath\n                  url\n                }\n              }\n              checkRuns(first: 10) {\n                edges {\n                  node {\n                    id\n                    databaseId\n                    name\n                    status\n                    conclusion\n                    startedAt\n                    completedAt\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}": types.GetCheckRunsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetCheckRuns($commitSha: String!) {\n  repository(owner: \"kachick\", name: \"wait-other-jobs\") {\n    object(expression: $commitSha) {\n      ... on Commit {\n        checkSuites(first: 10) {\n          edges {\n            node {\n              id\n              status\n              conclusion\n              workflowRun {\n                id\n                databaseId\n                createdAt\n                workflow {\n                  id\n                  databaseId\n                  name\n                  resourcePath\n                  url\n                }\n              }\n              checkRuns(first: 10) {\n                edges {\n                  node {\n                    id\n                    databaseId\n                    name\n                    status\n                    conclusion\n                    startedAt\n                    completedAt\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query GetCheckRuns($commitSha: String!) {\n  repository(owner: \"kachick\", name: \"wait-other-jobs\") {\n    object(expression: $commitSha) {\n      ... on Commit {\n        checkSuites(first: 10) {\n          edges {\n            node {\n              id\n              status\n              conclusion\n              workflowRun {\n                id\n                databaseId\n                createdAt\n                workflow {\n                  id\n                  databaseId\n                  name\n                  resourcePath\n                  url\n                }\n              }\n              checkRuns(first: 10) {\n                edges {\n                  node {\n                    id\n                    databaseId\n                    name\n                    status\n                    conclusion\n                    startedAt\n                    completedAt\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;