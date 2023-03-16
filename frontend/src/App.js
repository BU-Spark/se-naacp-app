import React from "react";

// CSS
import './App.css';

// Main navigator
import MainNavigator from './routes/MainNavigator'

// Universal Contexts
import { DateContext } from './contexts/dateContext'
import { StateContext } from './contexts/stateContext'
import { NeighborhoodContext } from './contexts/neighborhoodContext'

function App() {
  const [dates, setDates] = React.useState([null,null]);
  const [currentState, setState] = React.useState({});
  const [neighborhood, setNeigh] = React.useState("boston_city");

  return (
    <>
      <StateContext.Provider value={{currentState, setState}}>
        <DateContext.Provider value={{dates, setDates}}>
          <NeighborhoodContext.Provider value={{neighborhood, setNeigh}}>
            <MainNavigator />
          </NeighborhoodContext.Provider>
        </DateContext.Provider>
      </StateContext.Provider>
    </>
  );
}

export default App;
