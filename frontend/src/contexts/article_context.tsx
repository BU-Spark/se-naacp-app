import React from "react";
import { useLazyQuery, gql } from "@apollo/client";
import { Article } from "../__generated__/graphql"

type ArticleContextType = {
    articleData: Article | null,
    fetchArticleData: (query: any, options?: any) => void,
}

const ARTICLE_QUERY = gql`
query ArticleByDate($neighborhood: String!) {
    tractsByNeighborhood(neighborhood: $neighborhood) {
        articles
    }
}
`;

export const ArticleContext = React.createContext<ArticleContextType | null>(null);

const ArticleProvider: React.FC = ({children}: any) => {
    const [queryData, { data, loading, error }] = useLazyQuery(ARTICLE_QUERY);
    const [articles, setArticleData] = React.useState<Article | null>(null);

    React.useEffect(() => {
        if (!loading && data && !error) {
            setArticleData(data);
        }
    }, [loading, data, error]);

    const fetchArticleData = (options?: any) => {
        queryData({
            variables: options // This is where you pass in parameters
        })
    };

    return (
        <ArticleContext.Provider value={{ articleData: articles, fetchArticleData }}>
            {children}
        </ArticleContext.Provider>
    );
};

export default ArticleProvider;