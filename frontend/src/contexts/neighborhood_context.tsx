import React from "react";
import { useLazyQuery, gql } from "@apollo/client";
import { Neighborhoods } from "../__generated__/graphql"

type NeighborhoodContextType = {
    neighborhoodData: Neighborhoods[] | null,
    queryNeighborhoodDataType: (queryType: any, options?: any) => void,
}

// const NEIGHBORHOOD_DATA_QUERY = gql`
// query neighborhoodQuery($neighborhood: String!) {
//     tractsByNeighborhood(neighborhood: $neighborhood) {
//         articles
//         tracts
//         value
//     }
// }
// `;

const NEIGHBORHOOD_DATA_QUERY = gql`
    query neighborhoodQuery() {
        getAllNeighborhoods {
            value
        }
    }
`;

export const NeighborhoodContext = React.createContext<NeighborhoodContextType | null>(null);

const NeighborhoodProvider: React.FC = ({children}: any) => {
    const [queryNeighborhoodData, { data: neighborhoodData, loading: neighborhoodDataLoading, error: neighborhoodDataError }] = useLazyQuery(NEIGHBORHOOD_DATA_QUERY);

    const [neighborhoods, setNeighborhoodData] = React.useState<Neighborhoods[] | null>(null);

    React.useEffect(() => {
        if (neighborhoodData && !neighborhoodDataLoading && !neighborhoodDataError) {
            setNeighborhoodData(neighborhoodData.tractsByNeighborhood);
        }
    }, [neighborhoodData, neighborhoodDataLoading, neighborhoodDataError])

    const queryNeighborhoodDataType = (queryType: "NEIGHBORHOOD_DATA", options?: any) => {
        switch(queryType) {
            case "NEIGHBORHOOD_DATA":
                queryNeighborhoodData({
                    variables: options
                })
                break;
            default: 
                console.log("ERROR: Fetch Neighborhood Data does not have this queryType!");
                break;
        }
    };

    return (
        <NeighborhoodContext.Provider value={{ neighborhoodData: neighborhoods, queryNeighborhoodDataType }}>
            {children}
        </NeighborhoodContext.Provider>
    );
};

export default NeighborhoodProvider;




