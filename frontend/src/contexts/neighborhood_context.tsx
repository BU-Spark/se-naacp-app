import React from "react";
import { useLazyQuery, gql } from "@apollo/client";

type NeighborhoodContextType = {
  neighborhoodMasterList: string[] | null;
  neighborhood: string | null; 

  queryNeighborhoodDataType: (queryType: any, options?: any) => void;
  setNeighborhood: (neighborhood: string) => void; // Added this setter function
};

const NEIGHBORHOOD_DATA_QUERY = gql`
  query neighborhoodQuery {
    getAllNeighborhoods {
      value
    }
  }
`;

export const NeighborhoodContext =
  React.createContext<NeighborhoodContextType | null>(null);

const NeighborhoodProvider: React.FC = ({ children }: any) => {
  const [
    queryNeighborhoodData,
    {
      data: neighborhoodData,
      loading: neighborhoodDataLoading,
      error: neighborhoodDataError,
    },
  ] = useLazyQuery(NEIGHBORHOOD_DATA_QUERY);
  const [neighborhoods, setNeighborhoodData] = React.useState<string[] | null>(
    null
  );

  const [neighborhood, setNeighborhood] = React.useState<string | null>(null); // Added this state

  React.useEffect(() => {
    if (
      neighborhoodData &&
      !neighborhoodDataLoading &&
      !neighborhoodDataError
    ) {
      let neighborhoodMasterList: string[] = [];
      let data: any = neighborhoodData.getAllNeighborhoods;

      data.forEach((neighborhood: any) => {
        neighborhoodMasterList.push(neighborhood.value);
      });
      setNeighborhoodData(neighborhoodMasterList);
    }
  }, [neighborhoodData, neighborhoodDataLoading, neighborhoodDataError]);

  const queryNeighborhoodDataType = (
    queryType: "NEIGHBORHOOD_DATA",
    options?: any
  ) => {
    switch (queryType) {
      case "NEIGHBORHOOD_DATA":
        queryNeighborhoodData({});
        break;
      default:
        console.log(
          "ERROR: Fetch Neighborhood Data does not have this queryType!"
        );
        break;
    }
  };

  return (
    <NeighborhoodContext.Provider
      value={{
        neighborhoodMasterList: neighborhoods,
        queryNeighborhoodDataType,
        neighborhood,
        setNeighborhood,
      }}
    >
      {children}
    </NeighborhoodContext.Provider>
  );
};

export default NeighborhoodProvider;
