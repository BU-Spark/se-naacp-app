import React from "react";
import dayjs from "dayjs";

// CSS
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";

// Main navigator
import MainNavigator from "./routes/MainNavigator";
export const minDate = dayjs("2000-01-01"); // Hardcoded: Better to consult DB of smallest "DateSum"
export const maxDate = dayjs(dayjs().format("YYYY-MM-DD"));
function App() {
  return (
    <>
      <MainNavigator />
    </>
  );
}

export default App;
