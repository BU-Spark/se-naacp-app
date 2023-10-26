import React from "react";
import { useLazyQuery, gql } from "@apollo/client";
import { Neighborhoods } from "../__generated__/graphql"

type NeighborhoodContextType = {
    neighborhoodMasterList: string[] | null,
    queryNeighborhoodDataType: (queryType: any, options?: any) => void,
}

// this query does not take arguments
// future refactoring needed, currently we don't use this context to fill in neighborhood list
const NEIGHBORHOOD_DATA_QUERY = gql`
    query neighborhoodQuery {
        getAllNeighborhoods {
            value
        }
    }
`;

export const NeighborhoodContext = React.createContext<NeighborhoodContextType | null>(null);

const NeighborhoodProvider: React.FC = ({children}: any) => {
    const [queryNeighborhoodData, { data: neighborhoodData, loading: neighborhoodDataLoading, error: neighborhoodDataError }] = useLazyQuery(NEIGHBORHOOD_DATA_QUERY);

    const [neighborhoods, setNeighborhoodData] = React.useState<string[] | null>(null);

    React.useEffect(() => {
        if (neighborhoodData && !neighborhoodDataLoading && !neighborhoodDataError) {
            let neighborhoodMasterList: string[] = [];
            let data: any = neighborhoodData.getAllNeighborhoods;
            
            data.forEach((neighborhood: any) => {
                neighborhoodMasterList.push(neighborhood.value);
            });
            setNeighborhoodData(neighborhoodMasterList);
        }
    }, [neighborhoodData, neighborhoodDataLoading, neighborhoodDataError])

    const queryNeighborhoodDataType = (queryType: "NEIGHBORHOOD_DATA", options?: any) => {
        switch(queryType) {
            case "NEIGHBORHOOD_DATA":
                queryNeighborhoodData({});
                break;
            default: 
                console.log("ERROR: Fetch Neighborhood Data does not have this queryType!");
                break;
        }
    };

    return (
        <NeighborhoodContext.Provider value={{ neighborhoodMasterList: neighborhoods, queryNeighborhoodDataType }}>
            {children}
        </NeighborhoodContext.Provider>
    );
};

export default NeighborhoodProvider;




