import React from "react";
import dayjs from "dayjs";

// CSS
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";

// Main navigator
import MainNavigator from "./routes/MainNavigator";
export const minDate = dayjs(dayjs().subtract(1, "month").format("YYYY-MM-DD"));
export const maxDate = dayjs(dayjs().format("YYYY-MM-DD"));
function App() {
  return (
    <>
      <MainNavigator />
    </>
  );
}

export default App;
