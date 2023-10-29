import React from "react";
import { useLazyQuery, gql } from "@apollo/client";
import { Tracts } from "../__generated__/graphql"

type TractContextType = {
    tractData: Tracts | null,
    queryTractDataType: (queryType: any, options?: any) => void,
    setTract: React.Dispatch<React.SetStateAction<Tracts | null>>  // Added this setter type
}

const TRACT_DATA_QUERY = gql`
    query tractQuery($tract: String!) {
        demographicsByTracts(tract: $tract) {
            demographics {
                p2_001n
                p2_002n
                p2_003n
                p2_004n
                p2_005n
                p2_006n
                p2_007n
                p2_008n
                p2_009n
                p2_010n
            }
        }
    }
`;

export const TractContext = React.createContext<TractContextType | null>(null);

const TractProvider: React.FC = ({children}: any) => {
    const [queryTractData, { data: tractData, loading: tractDataLoading, error: tractDataError }] = useLazyQuery(TRACT_DATA_QUERY);
    const [tracts, setTractData] = React.useState<Tracts | null>(null);

    React.useEffect(() => {
        if (tractData && !tractDataLoading && !tractDataError) {
            setTractData(tractData.demographicsByTracts);
        }
    }, [tractData, tractDataLoading, tractDataError]);

    const queryTractDataType = (queryType: "TRACT_DATA", options?: any) => {
        switch(queryType) {
            case "TRACT_DATA":
                queryTractData({
                    variables: options
                });
                break;
            default:
                console.log("ERROR: Fetch Tract Data does not have this queryType!");
                break;
        }
    }

    return (
        <TractContext.Provider value={{ tractData: tracts, queryTractDataType, setTract: setTractData }}>
            {children}
        </TractContext.Provider>
    );
};

export default TractProvider;
