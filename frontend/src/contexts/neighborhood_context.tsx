import React from "react";
import { useLazyQuery, gql } from "@apollo/client";
import { Neighborhoods } from "../__generated__/graphql"

type NeighborhoodContextType = {
    neighborhoodData: Neighborhoods | null,
    fetchNeighborhoodData: (query: any, options?: any) => void,
}

const NEIGHBORHOOD_QUERY = gql`
query ArticleByDate($neighborhood: String!) {
    tractsByNeighborhood(neighborhood: $neighborhood) {
        value
    }
}
`;

export const NeighborhoodContext = React.createContext<NeighborhoodContextType | null>(null);

const NeighborhoodProvider: React.FC = ({children}: any) => {
    const [queryData, { data, loading, error }] = useLazyQuery(NEIGHBORHOOD_QUERY);
    const [neighborhood, setNeighborhoodData] = React.useState<Neighborhoods | null>(null);

    React.useEffect(() => {
        console.log(error)
        if (!loading && data && !error) {
            setNeighborhoodData(data);
        }
    }, [loading, data, error]);

    const fetchNeighborhoodData = (options?: any) => {
        queryData({
            variables: options // This is where you pass in parameters
        })
    };

    return (
        <NeighborhoodContext.Provider value={{ neighborhoodData: neighborhood, fetchNeighborhoodData }}>
            {children}
        </NeighborhoodContext.Provider>
    );
};

export default NeighborhoodProvider;




