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
  hl2: Scalars['String']['output'];
  link: Scalars['String']['output'];
  neighborhoods: Array<Scalars['String']['output']>;
  openai_labels: Array<Scalars['String']['output']>;
  position_section: Scalars['String']['output'];
  pub_date: Scalars['String']['output'];
  pub_name: Scalars['String']['output'];
  tracts: Array<Scalars['String']['output']>;
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
  articles: Array<Scalars['String']['output']>;
  tracts: Array<Scalars['String']['output']>;
  value: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  articleByDate?: Maybe<Array<Maybe<Article>>>;
  demographicsByTracts?: Maybe<Array<Maybe<Tracts>>>;
  getAllArticles: Array<Article>;
  getAllNeighborhoods: Array<Neighborhoods>;
  getAllTopics: Array<Scalars['String']['output']>;
  getUploadByUserId?: Maybe<Array<Maybe<Uploads>>>;
  tractsByNeighborhood?: Maybe<Array<Maybe<Neighborhoods>>>;
};


export type QueryArticleByDateArgs = {
  area: Scalars['String']['input'];
  dateFrom: Scalars['Int']['input'];
  dateTo: Scalars['Int']['input'];
};


export type QueryDemographicsByTractsArgs = {
  tract: Scalars['String']['input'];
};


export type QueryGetUploadByUserIdArgs = {
  user_id: Scalars['String']['input'];
};


export type QueryTractsByNeighborhoodArgs = {
  neighborhood: Scalars['String']['input'];
};

export type Tracts = {
  __typename?: 'Tracts';
  articles: Array<Scalars['String']['output']>;
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

export type ArticleQueryQueryVariables = Exact<{
  dateFrom: Scalars['Int']['input'];
  dateTo: Scalars['Int']['input'];
  area: Scalars['String']['input'];
}>;


export type ArticleQueryQuery = { __typename?: 'Query', articleByDate?: Array<{ __typename?: 'Article', content_id: string, hl1: string, link: string, pub_date: string, position_section: string, author: string, openai_labels: Array<string> } | null> | null };

export type NeighborhoodQueryQueryVariables = Exact<{
  neighborhood: Scalars['String']['input'];
}>;


export type NeighborhoodQueryQuery = { __typename?: 'Query', getAllNeighborhoods: Array<{ __typename?: 'Neighborhoods', value: string }> };

export type TractQueryQueryVariables = Exact<{
  tract: Scalars['String']['input'];
}>;


export type TractQueryQuery = { __typename?: 'Query', demographicsByTracts?: Array<{ __typename?: 'Tracts', demographics: { __typename?: 'Demographics', p2_001n?: string | null, p2_002n?: string | null, p2_003n?: string | null, p2_004n?: string | null, p2_005n?: string | null, p2_006n?: string | null, p2_007n?: string | null, p2_008n?: string | null, p2_009n?: string | null, p2_010n?: string | null } } | null> | null };

export type GetUploadByUserIdQueryVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type GetUploadByUserIdQuery = { __typename?: 'Query', getUploadByUserId?: Array<{ __typename?: 'Uploads', article_cnt: number, message: string, status: string, timestamp: string, uploadID: string, userID: string } | null> | null };


export const ArticleQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"articleQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dateFrom"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dateTo"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"area"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"articleByDate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"dateFrom"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dateFrom"}}},{"kind":"Argument","name":{"kind":"Name","value":"dateTo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dateTo"}}},{"kind":"Argument","name":{"kind":"Name","value":"area"},"value":{"kind":"Variable","name":{"kind":"Name","value":"area"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content_id"}},{"kind":"Field","name":{"kind":"Name","value":"hl1"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"pub_date"}},{"kind":"Field","name":{"kind":"Name","value":"position_section"}},{"kind":"Field","name":{"kind":"Name","value":"author"}},{"kind":"Field","name":{"kind":"Name","value":"openai_labels"}}]}}]}}]} as unknown as DocumentNode<ArticleQueryQuery, ArticleQueryQueryVariables>;
export const NeighborhoodQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"neighborhoodQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"neighborhood"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllNeighborhoods"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]} as unknown as DocumentNode<NeighborhoodQueryQuery, NeighborhoodQueryQueryVariables>;
export const TractQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"tractQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tract"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"demographicsByTracts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"tract"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tract"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"demographics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"p2_001n"}},{"kind":"Field","name":{"kind":"Name","value":"p2_002n"}},{"kind":"Field","name":{"kind":"Name","value":"p2_003n"}},{"kind":"Field","name":{"kind":"Name","value":"p2_004n"}},{"kind":"Field","name":{"kind":"Name","value":"p2_005n"}},{"kind":"Field","name":{"kind":"Name","value":"p2_006n"}},{"kind":"Field","name":{"kind":"Name","value":"p2_007n"}},{"kind":"Field","name":{"kind":"Name","value":"p2_008n"}},{"kind":"Field","name":{"kind":"Name","value":"p2_009n"}},{"kind":"Field","name":{"kind":"Name","value":"p2_010n"}}]}}]}}]}}]} as unknown as DocumentNode<TractQueryQuery, TractQueryQueryVariables>;
export const GetUploadByUserIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUploadByUserId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUploadByUserId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"user_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"article_cnt"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"uploadID"}},{"kind":"Field","name":{"kind":"Name","value":"userID"}}]}}]}}]} as unknown as DocumentNode<GetUploadByUserIdQuery, GetUploadByUserIdQueryVariables>;