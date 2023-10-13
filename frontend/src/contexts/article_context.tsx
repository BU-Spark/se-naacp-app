import React from "react";
import { useLazyQuery, gql } from "@apollo/client";
import { Article } from "../__generated__/graphql"

type ArticleContextType = {
    articleData: Article[] | null, // This is for components to consume
    neighborhoodMasterList: string[] | null, // This is for upon init, think of it as getting a master list of neighborhoods
    queryArticleDataType: (queryType: any, options?: any) => void,
}
/* Article Queries */
const ARTICLE_DATA_QUERY = gql`
    query articleQuery($dateFrom: Int!, $dateTo: Int!, $area: String!) {
        articleByDate(dateFrom: $dateFrom, dateTo: $dateTo, area: $area) {
            neighborhoods
        }
    }
`;

// *Note* I want to make this more dynamic. Maybe a future todo... (ASK ASAD)
const NEIGHBORHOOD_LIST_QUERY = gql`
    query neighborhoodQuery {
        getAllArticles {
            neighborhoods
        }
    }
`;

export const ArticleContext = React.createContext<ArticleContextType | null>(null);

const ArticleProvider: React.FC = ({children}: any) => { 
    const [queryArticleData, { data: articleData, loading: articleDataLoading, error: articleDataError }] = useLazyQuery(ARTICLE_DATA_QUERY);
    const [queryNeighborhoodData, { data: neighborhoodData, loading: neighborhoodDataLoading, error: neighborhoodDataError }] = useLazyQuery(NEIGHBORHOOD_LIST_QUERY);

    const [articles, setArticleData] = React.useState<Article[] | null>(null);
    const [neighborhoods, setNeighborhoodMasterList] = React.useState<string[] | null>(null);

    React.useEffect(() => {
        if (!articleData && articleDataLoading && !articleDataError) {
            setArticleData([articleData]);
        }
    }, [articleData, articleDataLoading, articleDataError]);

    React.useEffect(() => {
        if (neighborhoodData && !neighborhoodDataLoading && !neighborhoodDataError) {
            let neighborhood_arr: string[] = [];

            neighborhoodData.getAllArticles.forEach((elem: any) => {
                neighborhood_arr.push(elem.neighborhoods[0]);
            });

            neighborhood_arr = removeDuplicates(neighborhood_arr);

            setNeighborhoodMasterList(neighborhood_arr);
        }
    }, [neighborhoodData, neighborhoodDataLoading, neighborhoodDataError]);

    // Processor functions. (Thinking to apply them in sequence...)
    function removeDuplicates(input: string[]): string[] {
        return Array.from(new Set(input));
    }

    // Main fetch sequence
    // *Note* Maybe change queryType to take Enum?

    // query Type -> Indicates which useLazyQuery hook to execute
    // options? -> (Optional) Give the parameters needed for that useLazyQeury hook
    // func_ops? -> (Optional) What functions to execute left to right to the data
    const queryArticleDataType = (queryType: "ARTICLE_DATA" | "NEIGHBORHOOD_DATA", options?: any) => {
        switch(queryType) {
            case "ARTICLE_DATA":
                queryArticleData({
                    variables: options // This is where you pass in parameters
                })
                break;
            case "NEIGHBORHOOD_DATA":

                queryNeighborhoodData({
                    variables: {"neighborhood": "Downtown"}
                }) // No need for parameters, we are fetching a universal state
                break;
            default:
                // Something went wrong here, Needs to throw error to user...
                console.log("ERROR: Fetch Article Data does not have this queryType!");
                break;
        }
    };

    return (
        <ArticleContext.Provider value={{ articleData: articles, neighborhoodMasterList: neighborhoods, queryArticleDataType}}>
            {children}
        </ArticleContext.Provider>
    );
};

export default ArticleProvider;