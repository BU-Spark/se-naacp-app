import React from "react";
import dayjs from "dayjs";

// CSS
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";

// Main navigator
import MainNavigator from "./routes/MainNavigator";
export const minDate = dayjs("2020-11-01"); // Hardcoded: Better to consult DB of smallest "DateSum"
export const maxDate = dayjs(); // Set maxDate to the current date
function App() {
  return (
    <>
      <MainNavigator />
    </>
  );
}

export default App;
