import React from "react";
import { useLazyQuery, gql } from "@apollo/client";
import { Topics } from "../__generated__/graphql"

type TopicsContextType = {
    topicsMasterList: string[] | null,
    queryTopicsDataType: (queryType: any, options?: any) => void,
    topic: string | null,
    setTopic: (topic: string) => void
}

const TOPICS_DATA_QUERY = gql`
    query topicsQuery {
        getAllTopics {
            value
        }
    }
`;

export const TopicsContext = React.createContext<TopicsContextType | null>(null);

const TopicsProvider: React.FC = ({children}: any) => {
    const [queryTopicsData, { data: topicsData, loading: topicsDataLoading, error: topicsDataError }] = useLazyQuery(TOPICS_DATA_QUERY);

    const [topics, setTopicsData] = React.useState<string[] | null>(null);
    const [topic, setTopic] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (topicsData && !topicsDataLoading && !topicsDataError) {
            let topicsMasterList: string[] = [];
            let data: any = topicsData.getAllTopics;
            
            data.forEach((topic: any) => {
                topicsMasterList.push(topic.value);
            });
            setTopicsData(topicsMasterList);
        }
    }, [topicsData, topicsDataLoading, topicsDataError])

    const queryTopicsDataType = (queryType: "TOPICS_DATA", options?: any) => {
        switch(queryType) {
            case "TOPICS_DATA":
                queryTopicsData({});
                break;
            default: 
                console.log("ERROR: Fetch Neighborhood Data does not have this queryType!");
                break;
        }
    };

    return (
        <TopicsContext.Provider value={{ topicsMasterList: topics, queryTopicsDataType, topic, setTopic }}>
            {children}
        </TopicsContext.Provider>
    );
};

export default TopicsProvider;
