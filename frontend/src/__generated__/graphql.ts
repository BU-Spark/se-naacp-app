/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Article = {
  __typename?: 'Article';
  author: Scalars['String']['output'];
  body: Scalars['String']['output'];
  content_id: Scalars['String']['output'];
  dateSum: Scalars['Int']['output'];
  hl1: Scalars['String']['output'];
  link: Scalars['String']['output'];
  neighborhoods: Array<Scalars['String']['output']>;
  openai_labels: Scalars['String']['output'];
  pub_date: Scalars['String']['output'];
  pub_name: Scalars['String']['output'];
  tracts: Array<Scalars['String']['output']>;
  userID: Scalars['String']['output'];
  coordinates?: Array<Array<Scalars['Float']['output']>>; 
  locations?:Array<Scalars['String']['output']>;
};

export type Locations = {
  __typename?: 'Locations';
  articles: Array<Scalars['String']['output']>;
  coordinates: Array<Scalars['Float']['output']>;
  value: Scalars['String']['output'];
  city: Scalars['String']['output'];
  tract: Scalars['String']['output'];
  neighborhood: Scalars['String']['output'];
};

export type Demographics = {
  __typename?: 'Demographics';
  p2_001n: Scalars['String']['output'];
  p2_002n: Scalars['String']['output'];
  p2_003n: Scalars['String']['output'];
  p2_004n: Scalars['String']['output'];
  p2_005n: Scalars['String']['output'];
  p2_006n: Scalars['String']['output'];
  p2_007n: Scalars['String']['output'];
  p2_008n: Scalars['String']['output'];
  p2_009n: Scalars['String']['output'];
  p2_010n: Scalars['String']['output'];
};

export type Neighborhoods = {
  __typename?: 'Neighborhoods';
  articles?: Array<Scalars['String']['output']>;
  tracts: Array<Scalars['String']['output']>;
  value: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  articleByDate?: Maybe<Array<Maybe<Article>>>;
  articleByTopicsOrLabels?: Maybe<Array<Maybe<Article>>>;
  demographicsByTracts?: Maybe<Array<Maybe<Tracts>>>;
  getAllArticles: Array<Article>;
  getAllLabels: Array<Scalars['String']['output']>;
  getAllNeighborhoods: Array<Neighborhoods>;
  getAllTopics: Array<Scalars['String']['output']>;
  getUploadByUserId?: Maybe<Array<Maybe<Uploads>>>;
  tractsByNeighborhood?: Maybe<Array<Maybe<Neighborhoods>>>;
};


export type QueryArticleByDateArgs = {
  area: Scalars['String']['input'];
  dateFrom: Scalars['Int']['input'];
  dateTo: Scalars['Int']['input'];
  userID: Scalars['String']['input'];
};


export type QueryArticleByTopicsOrLabelsArgs = {
  area: Scalars['String']['input'];
  labelOrTopic: Scalars['String']['input'];
  userID: Scalars['String']['input'];
};


export type QueryDemographicsByTractsArgs = {
  tract: Scalars['String']['input'];
};


export type QueryGetAllLabelsArgs = {
  userID: Scalars['String']['input'];
};


export type QueryGetAllTopicsArgs = {
  userID: Scalars['String']['input'];
};


export type QueryGetUploadByUserIdArgs = {
  user_id: Scalars['String']['input'];
};


export type QueryTractsByNeighborhoodArgs = {
  neighborhood: Scalars['String']['input'];
};

export type Topics = {
  __typename?: 'Topics';
  articles: Array<Scalars['String']['output']>;
  value: Scalars['String']['output'];
};

export type Tracts = {
  __typename?: 'Tracts';
  articles?: Array<Scalars['String']['output']>;
  county_name: Scalars['String']['output'];
  demographics: Demographics;
  geoid_tract: Scalars['String']['output'];
  neighborhood: Scalars['String']['output'];
  tract: Scalars['String']['output'];
};

export type Uploads = {
  __typename?: 'Uploads';
  article_cnt: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  status: Scalars['String']['output'];
  timestamp: Scalars['String']['output'];
  uploadID: Scalars['String']['output'];
  userID: Scalars['String']['output'];
};

export type GetAllArticlesQueryVariables = Exact<{
  dateFrom: Scalars['Int']['input'];
  dateTo: Scalars['Int']['input'];
  area: Scalars['String']['input'];
  userId: Scalars['String']['input'];
}>;


export type GetAllArticlesQuery = { __typename?: 'Query', articleByDate?: Array<{ __typename?: 'Article', author: string, dateSum: number, hl1: string, link: string, neighborhoods: Array<string>, openai_labels: Array<string>, position_section: string, pub_date: string, tracts: Array<string> } | null> | null };

export type ArticleByTopicLabelQueryQueryVariables = Exact<{
  area: Scalars['String']['input'];
  labelOrTopic: Scalars['String']['input'];
  userId: Scalars['String']['input'];
}>;


export type ArticleByTopicLabelQueryQuery = { __typename?: 'Query', articleByTopicsOrLabels?: Array<{ __typename?: 'Article', author: string, dateSum: number, hl1: string, link: string, neighborhoods: Array<string>, openai_labels: Array<string>, position_section: string, pub_date: string, tracts: Array<string> } | null> | null };

export type NeighborhoodQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type NeighborhoodQueryQuery = { __typename?: 'Query', getAllNeighborhoods: Array<{ __typename?: 'Neighborhoods', value: string, tracts: Array<string> }> };

export type TopicsQueryQueryVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type TopicsQueryQuery = { __typename?: 'Query', getAllTopics: Array<string> };

export type GetAllLabelsQueryVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type GetAllLabelsQuery = { __typename?: 'Query', getAllLabels: Array<string> };

export type TractQueryQueryVariables = Exact<{
  tract: Scalars['String']['input'];
}>;


export type TractQueryQuery = { __typename?: 'Query', demographicsByTracts?: Array<{ __typename?: 'Tracts', tract: string, demographics?: { __typename?: 'Demographics', p2_001n?: string | null, p2_002n?: string | null, p2_003n?: string | null, p2_004n?: string | null, p2_005n?: string | null, p2_006n?: string | null, p2_007n?: string | null, p2_008n?: string | null, p2_009n?: string | null, p2_010n?: string | null } | null } | null> | null };

export type GetUploadByUserIdQueryVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type GetUploadByUserIdQuery = { __typename?: 'Query', getUploadByUserId?: Array<{ __typename?: 'Uploads', article_cnt: number, message: string, status: string, timestamp: string, uploadID: string, userID: string } | null> | null };


export const GetAllArticlesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllArticles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dateFrom"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dateTo"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"area"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"articleByDate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"dateFrom"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dateFrom"}}},{"kind":"Argument","name":{"kind":"Name","value":"dateTo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dateTo"}}},{"kind":"Argument","name":{"kind":"Name","value":"area"},"value":{"kind":"Variable","name":{"kind":"Name","value":"area"}}},{"kind":"Argument","name":{"kind":"Name","value":"userID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"author"}},{"kind":"Field","name":{"kind":"Name","value":"dateSum"}},{"kind":"Field","name":{"kind":"Name","value":"hl1"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"neighborhoods"}},{"kind":"Field","name":{"kind":"Name","value":"openai_labels"}},{"kind":"Field","name":{"kind":"Name","value":"position_section"}},{"kind":"Field","name":{"kind":"Name","value":"pub_date"}},{"kind":"Field","name":{"kind":"Name","value":"tracts"}}]}}]}}]} as unknown as DocumentNode<GetAllArticlesQuery, GetAllArticlesQueryVariables>;
export const ArticleByTopicLabelQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"articleByTopicLabelQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"area"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"labelOrTopic"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"articleByTopicsOrLabels"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"area"},"value":{"kind":"Variable","name":{"kind":"Name","value":"area"}}},{"kind":"Argument","name":{"kind":"Name","value":"labelOrTopic"},"value":{"kind":"Variable","name":{"kind":"Name","value":"labelOrTopic"}}},{"kind":"Argument","name":{"kind":"Name","value":"userID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"author"}},{"kind":"Field","name":{"kind":"Name","value":"dateSum"}},{"kind":"Field","name":{"kind":"Name","value":"hl1"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"neighborhoods"}},{"kind":"Field","name":{"kind":"Name","value":"openai_labels"}},{"kind":"Field","name":{"kind":"Name","value":"position_section"}},{"kind":"Field","name":{"kind":"Name","value":"pub_date"}},{"kind":"Field","name":{"kind":"Name","value":"tracts"}}]}}]}}]} as unknown as DocumentNode<ArticleByTopicLabelQueryQuery, ArticleByTopicLabelQueryQueryVariables>;
export const NeighborhoodQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"neighborhoodQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllNeighborhoods"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"tracts"}}]}}]}}]} as unknown as DocumentNode<NeighborhoodQueryQuery, NeighborhoodQueryQueryVariables>;
export const TopicsQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"topicsQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllTopics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}]}}]} as unknown as DocumentNode<TopicsQueryQuery, TopicsQueryQueryVariables>;
export const GetAllLabelsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllLabels"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllLabels"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}]}}]} as unknown as DocumentNode<GetAllLabelsQuery, GetAllLabelsQueryVariables>;
export const TractQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"tractQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tract"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"demographicsByTracts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"tract"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tract"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"demographics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"p2_001n"}},{"kind":"Field","name":{"kind":"Name","value":"p2_002n"}},{"kind":"Field","name":{"kind":"Name","value":"p2_003n"}},{"kind":"Field","name":{"kind":"Name","value":"p2_004n"}},{"kind":"Field","name":{"kind":"Name","value":"p2_005n"}},{"kind":"Field","name":{"kind":"Name","value":"p2_006n"}},{"kind":"Field","name":{"kind":"Name","value":"p2_007n"}},{"kind":"Field","name":{"kind":"Name","value":"p2_008n"}},{"kind":"Field","name":{"kind":"Name","value":"p2_009n"}},{"kind":"Field","name":{"kind":"Name","value":"p2_010n"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tract"}}]}}]}}]} as unknown as DocumentNode<TractQueryQuery, TractQueryQueryVariables>;
export const GetUploadByUserIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUploadByUserId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUploadByUserId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"user_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"article_cnt"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"uploadID"}},{"kind":"Field","name":{"kind":"Name","value":"userID"}}]}}]}}]} as unknown as DocumentNode<GetUploadByUserIdQuery, GetUploadByUserIdQueryVariables>;