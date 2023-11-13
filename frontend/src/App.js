import React from "react";
import dayjs from "dayjs";

// CSS
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";


// Main navigator
import MainNavigator from "./routes/MainNavigator";

function App() {
  const minDate = dayjs("2020-11-01"); // November 2020
  const maxDate = dayjs("2023-01-09"); // February 2021

  return (
    <>
      <MainNavigator />
    </>
  );
}

export default App;
