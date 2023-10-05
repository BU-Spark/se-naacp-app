import React from "react";
import { useLazyQuery, gql } from "@apollo/client";
import { Tracts } from "../__generated__/graphql"

type TractContextType = {
    tractData: Tracts | null,
    fetchData: (query: any, options?: any) => void,
}

const QUERY = gql`
query ArticleByDate($neighborhood: String!) {
    tractsByNeighborhood(neighborhood: $neighborhood) {
        articles
    }
}
`;

export const TractContext = React.createContext<TractContextType | null>(null);

const TractProvider: React.FC = ({children}: any) => {
    const [queryData, { data, loading, error }] = useLazyQuery(QUERY);
    const [tracts, setTractData] = React.useState<Tracts | null>(null);

    React.useEffect(() => {
        if (!loading && data && !error) {
            setTractData(data);
        }
    }, [loading, data, error]);

    const fetchData = (options?: any) => {
        queryData({
            variables: options // This is where you pass in parameters
        })
    };

    return (
        <TractContext.Provider value={{ tractData: tracts, fetchData }}>
            {children}
        </TractContext.Provider>
    );
};

export default TractProvider;




