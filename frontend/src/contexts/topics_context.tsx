import React from "react";
import { useLazyQuery, gql } from "@apollo/client";
import { Topics } from "../__generated__/graphql";

type TopicsContextType = {
  labelsMasterList: string[] | null;
  topicsMasterList: string[] | null;
  queryTopicsDataType: (queryType: any, options?: any) => void;
  topic: string | null;
  setTopic: (topic: string) => void;
};

const defaultTopicsContext: TopicsContextType = {
  topicsMasterList: null,
  labelsMasterList: null,

  queryTopicsDataType: () => {},
  topic: null,
  setTopic: () => {},
};

const TOPICS_DATA_QUERY = gql`
  query topicsQuery($userId: String!) {
    getAllTopics(userID: $userId)
  }
`;

const LABELS_DATA_QUERY = gql`
  query GetAllLabels($userId: String!) {
    getAllLabels(userID: $userId)
  }
`;

export const TopicsContext =
  React.createContext<TopicsContextType>(defaultTopicsContext);

const TopicsProvider: React.FC = ({ children }: any) => {
  const [
    queryTopicsData,
    { data: topicsData, loading: topicsDataLoading, error: topicsDataError },
  ] = useLazyQuery(TOPICS_DATA_QUERY);
  const [
    queryLabelsData,
    { data: labelsData, loading: labelsDataLoading, error: labelsDataError },
  ] = useLazyQuery(LABELS_DATA_QUERY);

  const [topics, setTopicsData] = React.useState<string[] | null>(null);
  const [labels, setLabelsData] = React.useState<string[] | null>(null);

  const [topic, setTopic] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (topicsData && !topicsDataLoading && !topicsDataError) {
      console.log(topicsData);
      setTopicsData(topicsData.getAllTopics);
    }
  }, [topicsData, topicsDataLoading, topicsDataError]);

  React.useEffect(() => {
    if (labelsData && !labelsDataLoading && !labelsDataError) {
      setLabelsData(labelsData.getAllLabels);
    }
  }, [labelsData, labelsDataLoading, labelsDataError]);

  const queryTopicsDataType = (queryType: string, options?: any) => {
    switch (queryType) {
      case "TOPICS_DATA":
        queryTopicsData({ variables: options });
        break;
      case "LABELS_DATA":
        queryLabelsData({ variables: options });
        break;
      default:
        console.log(
          "ERROR: Fetch Neighborhood Data does not have this queryType!"
        );
        break;
    }
  };

  return (
    <TopicsContext.Provider
      value={{
        topicsMasterList: topics,
        queryTopicsDataType,
        topic,
        setTopic,
        labelsMasterList: labels,
      }}
    >
      {children}
    </TopicsContext.Provider>
  );
};

export default TopicsProvider;
