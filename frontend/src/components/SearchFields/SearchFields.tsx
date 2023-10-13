import React from "react";

// Class Component
import SearchBarDropdown from "./SearchBarDropdown/SearchBarDropdown";
import Warning from "./Warnings/Warning";
import DateBar from "./DateBar/DateBar";

// React Contexts/Context Methods
import { DateContext, DateMethods } from "../../contexts/dateContext";

interface SearchFieldProps {
  showDropDown?: string;
}

const SearchFields: React.FC<SearchFieldProps> = (Props: SearchFieldProps) => {
  const { dates } = React.useContext(DateContext); // Global Context of Dates

  const [warn, setWarn] = React.useState<boolean>(false);

  const WarningBtn = (warningBool: boolean) => {
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
        </div>
      </div>
    </div>
  );
}

export default SearchFields;
