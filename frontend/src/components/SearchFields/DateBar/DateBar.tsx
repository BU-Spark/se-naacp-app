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

const DateField: React.FC<DateFieldProps> = ({ minDate, maxDate, isFrom }) => {
  const [date, setDate] = React.useState(isFrom ? minDate : maxDate);

  const handleChange = (d: any) => {
    setDate(d);
  };

  return (
    <div className="search">
      <p className="word">{isFrom ? "From" : "To"}</p>
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
