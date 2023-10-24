import React from "react";
import dayjs from "dayjs";

// CSS
import "./App.css";

// Main navigator
import MainNavigator from "./routes/MainNavigator";
import "bootstrap/dist/css/bootstrap.min.css";

// Universal Contexts
import { DateContext } from "./contexts/dateContext";
import { StateContext } from "./contexts/stateContext";
import { NeighborhoodContext2 } from "./contexts/neighborhoodContext";

function App() {
  const minDate = dayjs("2020-11-01"); // November 2020
  const maxDate = dayjs("2023-01-09"); // February 2021
  const [dates, setDates] = React.useState([minDate, maxDate]);
  const [currentState, setState] = React.useState({});
  const [neighborhood, setNeigh] = React.useState("boston_city");

  return (
    <>
      <StateContext.Provider value={{ currentState, setState }}>
        <DateContext.Provider value={{ dates, setDates }}>
          <NeighborhoodContext2.Provider value={{ neighborhood, setNeigh }}>
            <MainNavigator />
          </NeighborhoodContext2.Provider>
        </DateContext.Provider>
      </StateContext.Provider>
    </>
  );
}

export default App;
