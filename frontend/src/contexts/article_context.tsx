import React from "react";
import { useLazyQuery, gql } from "@apollo/client";
import { Article } from "../__generated__/graphql";

// Dynamic Runtime Dictionary
type ObjectTypes = string | number | boolean | string[] | Article[]; // I added some fundamental types as well
type DynamicDictionary = { [key: string]: ObjectTypes };

type ArticleContextType = {
  articleData: DynamicDictionary | null; // This is for components to consume
  queryArticleDataType: (queryType: any, options?: any) => void;
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
      position_section
      pub_date
      tracts
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
      position_section
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
    queryArticleTopicsOrLabels,
    {
      data: articleTopicsOrLabelsData,
      loading: articleTopicsOrLabelsDataLoading,
      error: articleTopicsOrLabelsDataError,
    },
  ] = useLazyQuery(ARTICLE_BY_LABEL_OR_TOPIC);

  const [writtenKey, setWrittenKey] = React.useState<string | null>(null); 
  const [articles, setArticleData] = React.useState<DynamicDictionary>({});
  const [shouldRefresh, setShouldRefresh] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    if (articleData && !articleDataLoading && !articleDataError) {
      if (writtenKey != null) {
        articles[writtenKey] = articleData.articleByDate;
        setArticleData(articles);
      }
    }
  }, [articleData, articleDataLoading, articleDataError]);

  React.useEffect(() => {
    if (
      articleTopicsOrLabelsData &&
      !articleTopicsOrLabelsDataLoading &&
      !articleTopicsOrLabelsDataError
    ) {
      if (articleTopicsOrLabelsData.articleByTopicsOrLabels.length === 0) {
        if (writtenKey != null) {
          delete articles[writtenKey];
          setArticleData(articles); 
        }
      } else {
        if (writtenKey != null) {
          // Articles[] -> articleTopicsOrLabelsData.articleByTopicsOrLabels
          articles[writtenKey] = articleTopicsOrLabelsData.articleByTopicsOrLabels
          setArticleData(articles);
        }
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

  // queryType -> Indicates which useLazyQuery hook to execute
  // key -> The key you want the data to be stored as
  // options? -> (Optional) Give the parameters needed for that useLazyQeury hook
  // func_ops? -> (Optional) What functions to execute left to right to the data (DEPRECATED)
  const queryArticleDataType = (queryType: string, key: string,  options?: any) => {
    setWrittenKey(key); // Set the key for the dictionary
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

  return (
    <ArticleContext.Provider
      value={{ articleData: articles, queryArticleDataType, shouldRefresh: shouldRefresh, setShouldRefresh }}
    >
      {children}
    </ArticleContext.Provider>
  );
};

export default ArticleProvider;
