import React from "react";
import { useLazyQuery, gql } from "@apollo/client";
import { Tracts } from "../__generated__/graphql"

type TractContextType = {
    tractData: Tracts | null,
    fetchTractData: (query: any, options?: any) => void,
}

const TRACT_QUERY = gql`
query ArticleByDate($neighborhood: String!) {
    tractsByNeighborhood(neighborhood: $neighborhood) {
        articles
    }
}
`;

export const TractContext = React.createContext<TractContextType | null>(null);

const TractProvider: React.FC = ({children}: any) => {
    const [queryData, { data, loading, error }] = useLazyQuery(TRACT_QUERY);
    const [tracts, setTractData] = React.useState<Tracts | null>(null);

    React.useEffect(() => {
        if (!loading && data && !error) {
            setTractData(data);
        }
    }, [loading, data, error]);

    const fetchTractData = (options?: any) => {
        queryData({
            variables: options // This is where you pass in parameters
        })
    };

    return (
        <TractContext.Provider value={{ tractData: tracts, fetchTractData }}>
            {children}
        </TractContext.Provider>
    );
};

export default TractProvider;




