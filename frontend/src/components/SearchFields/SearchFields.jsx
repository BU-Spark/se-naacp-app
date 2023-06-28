import React from "react";
import Button from "@mui/material/Button";

// Class Component
import SearchBarDropdown from "./SearchBarDropdown/SearchBarDropdown";
import Warning from "./Warning";
import DateBar from "./DateBar/DateBar";
import CensusDropdown from "./CensusDropdown/CensusDropdown";

// React Contexts/Context Methods
import { StateContext, stateMethods } from "../../contexts/stateContext.js";
import { DateContext, DateMethods } from "../../contexts/dateContext";

function SearchFields(Props) {
  const { currentState, setState } = React.useContext(StateContext); // Global Context of States
  const { dates } = React.useContext(DateContext); // Global Context of Dates

  const [warn, setWarn] = React.useState(false);

  const WarningBtn = (warningBool) => {
    if (warningBool) {
      return <Warning></Warning>;
    }
  };

  React.useEffect(() => {
    if (!DateMethods.dateValidation(dates[0], dates[1])) {
      setWarn(true);
    } else {
      setWarn(false);
    }
  }, [dates]);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", overflowX: "auto" }}
    >
      <p   style={{ marginLeft: "10px",display: Props.showDropDown == "false" ? "block" : "none" }}  >Filter articles by date</p>

      <div style={{ display: "flex", flexDirection: "row", overflowX: "auto" }}>
        <div
          style={{ display: Props.showDropDown == "true" ? "block" : "none" }}
        >
          <SearchBarDropdown word="Neighborhoods"></SearchBarDropdown>
        </div>
        {/* <CensusDropdown word="Census Tract"></CensusDropdown> */}

        {WarningBtn(warn)}
        <DateBar word="From" from_bool={true}></DateBar>
        <DateBar word="To" from_bool={false}></DateBar>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "90px",
            width: "50px",
          }}
        >
          {/* <Button
          onClick={() => {
            console.log("Downloading Data...");
          }}
          variant="contained"
          sx={{ textTransform: "none" }}
          style={{
            height: "35px",
            width: "135px",
            marginTop: 21,
            marginLeft: 5,
            fontWeight: 500,
            fontSize: 14,
            backgroundColor: "rgb(93, 63, 211)",
          }}
        >
          Download Data
        </Button> */}
        </div>
      </div>
    </div>
  );
}

export default SearchFields;
