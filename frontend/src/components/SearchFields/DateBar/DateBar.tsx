import React from "react";
import "./DateBar.css";
import TextField from "@mui/material/TextField";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { DateContext } from "../../../contexts/dateContext.js";

interface DateFieldProps {
  title: string;
  minDate: Dayjs;
  maxDate: Dayjs;
  isFrom: boolean;
}

const DateField: React.FC<DateFieldProps> = ({
  title,
  minDate,
  maxDate,
  isFrom,
}) => {
  const { setDates, dates } = React.useContext(DateContext);
  const [date, setDate] = React.useState(isFrom ? dates[0] : dates[1]);

  // setDates([minDate,maxDate]);
  const handleChange = (d: any) => {
    if (dates === undefined) {
      setDates([null, null]);
    } else {
      isFrom
        ? setDates([d, dates[1] === null ? maxDate : dates[1]])
        : setDates([dates[0] === null ? minDate : dates[0], d]);
      setDate(d);
    }
  };

  return (
    <div className="search">
      <p className="word">{title}</p>
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
};

export default DateField;
