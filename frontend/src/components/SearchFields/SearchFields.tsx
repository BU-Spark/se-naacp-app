import React from "react";
import dayjs, { Dayjs } from "dayjs";
import { minDate, maxDate } from "../../App";
// Class Component
import SearchBarDropdown from "./SearchBarDropdown/SearchBarDropdown";
import DateBar from "./DateBar/DateBar";

interface SearchFieldProps {
  listOfWords: string[];
  showDropDown: boolean;
}

const SearchFields: React.FC<SearchFieldProps> = ({
  listOfWords,
  showDropDown,
}) => {

  return (
    <div
      style={{ display: "flex", flexDirection: "column", overflowX: "auto" }}
    >
      <p
        style={{
          marginLeft: "10px",
          display: showDropDown ? "none" : "block",
        }}
      >
        Filter articles by date
      </p>

      <div style={{ display: "flex", flexDirection: "row", overflowX: "auto" }}>
        <div style={{ display: showDropDown ? "block" : "none" }}>
          <SearchBarDropdown
            listOfWords={listOfWords}
            title="Neighborhoods"
          ></SearchBarDropdown>
        </div>

        {/* {WarningBtn(warn)} */}
        <DateBar
          title="From"
          isTopicsPage={true}
        ></DateBar>
        <DateBar
          title="To"
          isTopicsPage={false}
        ></DateBar>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "90px",
            width: "50px",
          }}
        ></div>
      </div>
    </div>
  );
};

export default SearchFields;
