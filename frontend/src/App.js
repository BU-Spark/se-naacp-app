import React from "react";

// CSS
import './App.css';

// Main navigator
import MainNavigator from './routes/MainNavigator'

// Universal Contexts
import { DateContext } from './contexts/dateContext'

function App() {
  const [dates, setDates] = React.useState([null,null]);

  return (
    <>
      <DateContext.Provider value={{dates, setDates}}>
        <MainNavigator />
      </DateContext.Provider>
    </>
  );
}

export default App;
