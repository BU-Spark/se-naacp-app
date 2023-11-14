import React from "react";
import dayjs from "dayjs";

// CSS
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";

// Main navigator
import MainNavigator from "./routes/MainNavigator";
export const minDate = dayjs("2020-11-01");
export const maxDate = dayjs("2023-01-09");
function App() {
  return (
    <>
      <MainNavigator />
    </>
  );
}

export default App;
