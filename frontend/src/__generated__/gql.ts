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
    "\n  query GetAllArticles(\n    $dateFrom: Int!\n    $dateTo: Int!\n    $area: String!\n    $userId: String!\n  ) {\n    articleByDate(\n      dateFrom: $dateFrom\n      dateTo: $dateTo\n      area: $area\n      userID: $userId\n    ) {\n      author\n      dateSum\n      hl1\n      link\n      neighborhoods\n      openai_labels\n      position_section\n      pub_date\n      tracts\n    }\n  }\n": types.GetAllArticlesDocument,
    "\n  query articleByTopicLabelQuery(\n    $area: String!\n    $labelOrTopic: String!\n    $userId: String!\n  ) {\n    articleByTopicsOrLabels(\n      area: $area\n      labelOrTopic: $labelOrTopic\n      userID: $userId\n    ) {\n      author\n      dateSum\n      hl1\n      link\n      neighborhoods\n      openai_labels\n      position_section\n      pub_date\n      tracts\n    }\n  }\n": types.ArticleByTopicLabelQueryDocument,
    "\n  query neighborhoodQuery {\n    getAllNeighborhoods {\n      value\n      tracts\n    }\n  }\n": types.NeighborhoodQueryDocument,
    "\n  query topicsQuery($userId: String!) {\n    getAllTopics(userID: $userId)\n  }\n": types.TopicsQueryDocument,
    "\n  query GetAllLabels($userId: String!) {\n    getAllLabels(userID: $userId)\n  }\n": types.GetAllLabelsDocument,
    "\n    query tractQuery($tract: String!) {\n        demographicsByTracts(tract: $tract) {\n            demographics {\n                p2_001n\n                p2_002n\n                p2_003n\n                p2_004n\n                p2_005n\n                p2_006n\n                p2_007n\n                p2_008n\n                p2_009n\n                p2_010n\n            }\n            tract\n        }\n    }\n": types.TractQueryDocument,
    "\n  query GetUploadByUserId($userId: String!) {\n  getUploadByUserId(user_id: $userId) {\n    article_cnt\n    message\n    status\n    timestamp\n    uploadID\n    userID\n  }\n}\n": types.GetUploadByUserIdDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetAllArticles(\n    $dateFrom: Int!\n    $dateTo: Int!\n    $area: String!\n    $userId: String!\n  ) {\n    articleByDate(\n      dateFrom: $dateFrom\n      dateTo: $dateTo\n      area: $area\n      userID: $userId\n    ) {\n      author\n      dateSum\n      hl1\n      link\n      neighborhoods\n      openai_labels\n      position_section\n      pub_date\n      tracts\n    }\n  }\n"): (typeof documents)["\n  query GetAllArticles(\n    $dateFrom: Int!\n    $dateTo: Int!\n    $area: String!\n    $userId: String!\n  ) {\n    articleByDate(\n      dateFrom: $dateFrom\n      dateTo: $dateTo\n      area: $area\n      userID: $userId\n    ) {\n      author\n      dateSum\n      hl1\n      link\n      neighborhoods\n      openai_labels\n      position_section\n      pub_date\n      tracts\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query articleByTopicLabelQuery(\n    $area: String!\n    $labelOrTopic: String!\n    $userId: String!\n  ) {\n    articleByTopicsOrLabels(\n      area: $area\n      labelOrTopic: $labelOrTopic\n      userID: $userId\n    ) {\n      author\n      dateSum\n      hl1\n      link\n      neighborhoods\n      openai_labels\n      position_section\n      pub_date\n      tracts\n    }\n  }\n"): (typeof documents)["\n  query articleByTopicLabelQuery(\n    $area: String!\n    $labelOrTopic: String!\n    $userId: String!\n  ) {\n    articleByTopicsOrLabels(\n      area: $area\n      labelOrTopic: $labelOrTopic\n      userID: $userId\n    ) {\n      author\n      dateSum\n      hl1\n      link\n      neighborhoods\n      openai_labels\n      position_section\n      pub_date\n      tracts\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query neighborhoodQuery {\n    getAllNeighborhoods {\n      value\n      tracts\n    }\n  }\n"): (typeof documents)["\n  query neighborhoodQuery {\n    getAllNeighborhoods {\n      value\n      tracts\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query topicsQuery($userId: String!) {\n    getAllTopics(userID: $userId)\n  }\n"): (typeof documents)["\n  query topicsQuery($userId: String!) {\n    getAllTopics(userID: $userId)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetAllLabels($userId: String!) {\n    getAllLabels(userID: $userId)\n  }\n"): (typeof documents)["\n  query GetAllLabels($userId: String!) {\n    getAllLabels(userID: $userId)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query tractQuery($tract: String!) {\n        demographicsByTracts(tract: $tract) {\n            demographics {\n                p2_001n\n                p2_002n\n                p2_003n\n                p2_004n\n                p2_005n\n                p2_006n\n                p2_007n\n                p2_008n\n                p2_009n\n                p2_010n\n            }\n            tract\n        }\n    }\n"): (typeof documents)["\n    query tractQuery($tract: String!) {\n        demographicsByTracts(tract: $tract) {\n            demographics {\n                p2_001n\n                p2_002n\n                p2_003n\n                p2_004n\n                p2_005n\n                p2_006n\n                p2_007n\n                p2_008n\n                p2_009n\n                p2_010n\n            }\n            tract\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetUploadByUserId($userId: String!) {\n  getUploadByUserId(user_id: $userId) {\n    article_cnt\n    message\n    status\n    timestamp\n    uploadID\n    userID\n  }\n}\n"): (typeof documents)["\n  query GetUploadByUserId($userId: String!) {\n  getUploadByUserId(user_id: $userId) {\n    article_cnt\n    message\n    status\n    timestamp\n    uploadID\n    userID\n  }\n}\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;