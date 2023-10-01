/* eslint-disable */
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
  _id: Scalars['ID']['output'];
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
  p2_001n?: Maybe<Scalars['String']['output']>;
  p2_002n?: Maybe<Scalars['String']['output']>;
  p2_003n?: Maybe<Scalars['String']['output']>;
  p2_004n?: Maybe<Scalars['String']['output']>;
  p2_005n?: Maybe<Scalars['String']['output']>;
  p2_006n?: Maybe<Scalars['String']['output']>;
  p2_007n?: Maybe<Scalars['String']['output']>;
  p2_008n?: Maybe<Scalars['String']['output']>;
  p2_009n?: Maybe<Scalars['String']['output']>;
  p2_010n?: Maybe<Scalars['String']['output']>;
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
};


export type QueryArticleByDateArgs = {
  dateFrom: Scalars['Int']['input'];
  dateTo: Scalars['Int']['input'];
  neighborhood: Scalars['String']['input'];
};

export type Tracts = {
  __typename?: 'Tracts';
  _id: Scalars['ID']['output'];
  articles: Array<Scalars['String']['output']>;
  county_name: Scalars['String']['output'];
  demographics: Demographics;
  geoid_tract: Scalars['String']['output'];
  neighborhood: Scalars['String']['output'];
  tract: Scalars['String']['output'];
};
