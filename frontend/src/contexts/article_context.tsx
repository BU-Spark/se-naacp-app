import React from "react";
import { useLazyQuery, gql } from "@apollo/client";
import { Article } from "../__generated__/graphql";

type ArticleContextType = {
  articleData: Article[] | null; // This is for components to consume
  articleData2: Article[] | null // for all neighborhood bar
  queryArticleDataType: (queryType: any, options?: any) => void;
  queryArticleDataType2: (queryType: any, options?: any) => void;
  shouldRefresh: boolean | null;
  setShouldRefresh: (flag: boolean) => void;
};
/* Article Queries */
// We will pass what we need in here
const ARTICLE_DATA_QUERY = gql`
  query GetAllArticles(
    $dateFrom: Int!
    $dateTo: Int!
    $area: String!
    $userId: String!
  ) {
    articleByDate(
      dateFrom: $dateFrom
      dateTo: $dateTo
      area: $area
      userID: $userId
    ) {
      author
      dateSum
      hl1
      link
      neighborhoods
      openai_labels
      pub_date
      tracts
      coordinates
      content_id
      locations
    }
  }
`;

const ARTICLE_BY_LABEL_OR_TOPIC = gql`
  query articleByTopicLabelQuery(
    $dateFrom: Int!
    $dateTo: Int!
    $area: String!
    $labelOrTopic: String!
    $userId: String!
  ) {
    articleByTopicsOrLabels(
      dateFrom: $dateFrom
      dateTo: $dateTo
      area: $area
      labelOrTopic: $labelOrTopic
      userID: $userId
    ) {
      author
      dateSum
      hl1
      link
      neighborhoods
      openai_labels
      pub_date
      tracts
    }
  }
`;

export const ArticleContext = React.createContext<ArticleContextType | null>(
  null
);

const ArticleProvider: React.FC = ({ children }: any) => {
  const [
    queryArticleData,
    { data: articleData, loading: articleDataLoading, error: articleDataError },
  ] = useLazyQuery(ARTICLE_DATA_QUERY);

  const [
    queryArticleData2,
    { data: articleData2, loading: articleData2Loading, error: articleData2Error },
  ] = useLazyQuery(ARTICLE_DATA_QUERY);

  const [
    queryArticleTopicsOrLabels,
    {
      data: articleTopicsOrLabelsData,
      loading: articleTopicsOrLabelsDataLoading,
      error: articleTopicsOrLabelsDataError,
    },
  ] = useLazyQuery(ARTICLE_BY_LABEL_OR_TOPIC);

  const [articles, setArticleData] = React.useState<Article[] | null>(null);
  // article 2
  const [articles2, setArticleData2] = React.useState<Article[] | null>(null);
  const [shouldRefresh, setShouldRefresh] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    if (articleData && !articleDataLoading && !articleDataError) {
      setArticleData(articleData.articleByDate);
    }
  }, [articleData, articleDataLoading, articleDataError]);

  React.useEffect(() => {
    if (articleData2 && !articleData2Loading && !articleData2Error) {
      setArticleData2(articleData2.articleByDate);
    }
  }, [articleData2 ? JSON.parse(JSON.stringify(articleData2)) : articleData2, articleData2Loading, articleData2Error]);
  // we added JSON.parse here because we force react to recognize both articleData and articleData2. 
  // Otherwise, react thinks they are the same and only processes articleData and ignores useEffect of articleData2. 

  React.useEffect(() => {
    if (
      articleTopicsOrLabelsData &&
      !articleTopicsOrLabelsDataLoading &&
      !articleTopicsOrLabelsDataError
    ) {
      if (articleTopicsOrLabelsData.articleByTopicsOrLabels.length === 0) {
        setArticleData(null);
        setArticleData2(null);
      } else {
        setArticleData(articleTopicsOrLabelsData.articleByTopicsOrLabels);
        setArticleData2(articleTopicsOrLabelsData.articleByTopicsOrLabels);
      }
    }
  }, [
    articleTopicsOrLabelsData,
    articleTopicsOrLabelsDataLoading,
    articleTopicsOrLabelsDataError,
  ]);

  // Processor functions. (Thinking to apply them in sequence...)
  function removeDuplicates(input: string[]): string[] {
    return Array.from(new Set(input));
  }

  // Main fetch sequence
  // *Note* Maybe change queryType to take Enum?

  // query Type -> Indicates which useLazyQuery hook to execute
  // options? -> (Optional) Give the parameters needed for that useLazyQeury hook
  // func_ops? -> (Optional) What functions to execute left to right to the data
  const queryArticleDataType = (queryType: string, options?: any) => {
    switch (queryType) {
      case "ARTICLE_DATA":
        queryArticleData({
          variables: options, // This is where you pass in parameters
        });
        break;
      case "ARTICLE_BY_LABEL_OR_TOPIC":
        queryArticleTopicsOrLabels({
          variables: options, // This is where you pass in parameters
        });
        break;
      default:
        // Something went wrong here, Needs to throw error to user...
        console.log("ERROR: Fetch Article Data does not have this queryType!");
        break;
    }
  };

  const queryArticleDataType2 = (queryType: string, options?: any) => {
    switch (queryType) {
      case "ARTICLE_DATA":
        queryArticleData2({
          variables: options, // This is where you pass in parameters
        });
        break;
      case "ARTICLE_BY_LABEL_OR_TOPIC":
        queryArticleTopicsOrLabels({
          variables: options, // This is where you pass in parameters
        });
        break;
      default:
        // Something went wrong here, Needs to throw error to user...
        console.log("ERROR: Fetch Article Data 2 does not have this queryType!");
        break;
    }
  };

  return (
    <ArticleContext.Provider
      value={
        { articleData: articles, 
          articleData2: articles2,
          queryArticleDataType, 
          queryArticleDataType2,
          shouldRefresh: shouldRefresh, 
          setShouldRefresh }}
    >
      {children}
    </ArticleContext.Provider>
  );
};

export default ArticleProvider;
