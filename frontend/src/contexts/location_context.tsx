import React, { createContext, useContext } from "react";
import { useLazyQuery, gql } from "@apollo/client";
import { Locations } from "../__generated__/graphql";

type LocationsContextType = {
  locationsData: Locations[] | null;
  queryLocationsData: () => void;
};

const GET_ALL_LOCATIONS = gql`
  query getAllLocations {
    getAllLocations {
      coordinates
      articles
      value
      city
      tract
      neighborhood
    }
  }
`;



const defaultLocationsContext: LocationsContextType = {
  locationsData: null,
  queryLocationsData: () => {},
};

export const LocationContext = createContext<LocationsContextType>(defaultLocationsContext);

const LocationsProvider: React.FC = ({ children }:any) => {
  const [queryLocations, { data: locationsData, loading, error }] = useLazyQuery(GET_ALL_LOCATIONS);

  const queryLocationsData = () => {
    queryLocations();
  };


  return (
    <LocationContext.Provider value={{ locationsData: locationsData?.getAllLocations as Locations[], queryLocationsData }}>
      {children}
    </LocationContext.Provider>
  );
};

export default LocationsProvider;
