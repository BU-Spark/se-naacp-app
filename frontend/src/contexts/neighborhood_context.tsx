import React from "react";
import { useLazyQuery, gql } from "@apollo/client";
import { Neighborhoods } from "../__generated__/graphql";

type NeighborhoodContextType = {
  neighborhoodMasterList: { [key: string]: string[] } | null;
  neighborhood: string | null;

  queryNeighborhoodDataType: (queryType: any, options?: any) => void;
  setNeighborhood: (neighborhood: string) => void; // Added this setter function
};

const NEIGHBORHOOD_DATA_QUERY = gql`
  query neighborhoodQuery {
    getAllNeighborhoods {
      value
      tracts
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
  const [neighborhoods, setNeighborhoodData] = React.useState<{
    [key: string]: string[];
  } | null>(null);

  const [neighborhood, setNeighborhood] = React.useState<string | null>(null); // Added this state

  React.useEffect(() => {
    if (
      neighborhoodData &&
      !neighborhoodDataLoading &&
      !neighborhoodDataError
    ) {
      const deconstructedNeighborhoods: { [key: string]: string[] } = {};

      neighborhoodData.getAllNeighborhoods.forEach(
        (neighborhood: { value: string; tracts: string[] }) => {
          deconstructedNeighborhoods[neighborhood.value] = neighborhood.tracts;
        }
      );

      setNeighborhoodData(deconstructedNeighborhoods);
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
