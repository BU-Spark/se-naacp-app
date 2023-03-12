import React from "react";

// CSS
import './App.css';

// Main navigator
import MainNavigator from './routes/MainNavigator'

// Universal Contexts
import { DateContext } from './contexts/dateContext'
import { StateContext } from './contexts/stateContext'

function App() {
  const [dates, setDates] = React.useState([null,null]);
  const [currentState, setState] = React.useState({});

  return (
    <>
      <StateContext.Provider value={{currentState, setState}}>
        <DateContext.Provider value={{dates, setDates}}>
          <MainNavigator />
        </DateContext.Provider>
      </StateContext.Provider>
    </>
  );
}

export default App;
