import React from "react";
import "./DateBar.css";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { DateContext } from "../../../contexts/dateContext.js";

function DateBar({ word, from_bool }) {
  const minDate = dayjs("2020-11-01"); // November 2020
  const maxDate = dayjs("2021-02-28"); // February 2021
  const { setDates, dates } = React.useContext(DateContext);
  const [date, setDate] = React.useState(from_bool ? minDate : maxDate);
  
  // setDates([minDate,maxDate]);
  const handleChange = (d) => {
    if (dates === undefined) {
      setDates([null, null]);
    } else {
      from_bool
        ? setDates([d, dates[1] === null ? maxDate : dates[1]])
        : setDates([dates[0] === null ? minDate : dates[0], d]);
      setDate(d);
    }
  };

  return (
    <div className="search">
      <p className="word">{word}</p>
      <div style={{ marginLeft: 9, marginTop: 5 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            inputFormat="MM/DD/YYYY"
            value={date}
            onChange={handleChange}
            minDate={minDate}
            maxDate={maxDate}
            renderInput={(params) => (
              <TextField
                sx={{
                  width: "97%",
                  "& .MuiInputBase-root": {
                    borderRadius: 0.5,
                    height: 34,
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderWidth: 2,
                      borderColor: "#ccc",
                    },
                    "&:hover fieldset": {
                      borderColor: "#ccc",
                    },
                  },
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "#ccc",
                  },
                }}
                {...params}
              />
            )}
          />
        </LocalizationProvider>
      </div>
    </div>
  );
}

export default DateBar;
