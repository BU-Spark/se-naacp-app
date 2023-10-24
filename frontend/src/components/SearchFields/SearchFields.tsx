import React from "react";
import dayjs, { Dayjs } from "dayjs";

// Class Component
import SearchBarDropdown from "./SearchBarDropdown/SearchBarDropdown";
import Warning from "./Warnings/Warning";
import DateBar from "./DateBar/DateBar";

// React Contexts/Context Methods
import { DateContext, DateMethods } from "../../contexts/dateContext";

interface SearchFieldProps {
  minDate: Dayjs;
  maxDate: Dayjs;
  listOfWords: string[];
  showDropDown: boolean;
}

const SearchFields: React.FC<SearchFieldProps> = ({
  minDate,
  maxDate,
  listOfWords,
  showDropDown,
}) => {
  const { dates } = React.useContext(DateContext); // Global Context of Dates

  // const [warn, setWarn] = React.useState<boolean>(false);

  // const WarningBtn = (warningBool: boolean) => {
  //   if (warningBool) {
  //     return <Warning></Warning>;
  //   }
  // };

  // React.useEffect(() => {
  //   if (!DateMethods.dateValidation(dates[0], dates[1])) {
  //     setWarn(true);
  //   } else {
  //     setWarn(false);
  //   }
  // }, [dates]);

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
          isFrom={true}
          minDate={minDate}
          maxDate={maxDate}
        ></DateBar>
        <DateBar
          title="To"
          isFrom={false}
          minDate={minDate}
          maxDate={maxDate}
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
