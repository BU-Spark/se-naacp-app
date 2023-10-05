import React from "react";
import { useState, useEffect, createContext, useContext } from 'react';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import App from "../App";
import { Neighborhoods } from "../__generated__/graphql"

type NeighborhoodContextType = {
  Neighborhood: Neighborhoods | null,
  fetchData: (query: any, options?: any) => void;
}

const NeighborhoodContext = React.createContext<NeighborhoodContextType | null>(null);

export const NeighborhoodProvider: React.FC = (children: any) => {
    const [neighborhoodData, setNeighborhoodData] = useState<Neighborhoods | null>(null);
  
    const fetchData = (query: any, options?: any) => {
      const { data, loading, error } = useQuery(query, options);

      if (!loading && data && !error) {
        setNeighborhoodData(data);
      }
    };
  
    return (
      <NeighborhoodContext.Provider value={{ Neighborhood: neighborhoodData, fetchData }}>
        {children}
      </NeighborhoodContext.Provider>
    );
  };

export default NeighborhoodContext;




