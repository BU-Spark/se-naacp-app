import React from "react";

// CSS
import "./SearchBar.css";

// MUI Material
import TextField from '@mui/material/TextField';

// MUI Date Picker
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';  // Day.js adapter
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

// React Contexts
import { DateContext } from '../../contexts/dateContext.js';

// Quick note: from_bool just lets the component know if this is a from date or to date
// The context date format is two objects (dayjs Objects) stored in a array --> ["",""], [0] = From [1] = To

function DateBar({ word, from_bool}) {
  const {setDates, dates} = React.useContext(DateContext);  // Global Context of dates
  const [date, setDate] = React.useState(dayjs());

  const handleChange = (d) => {
    if (dates === undefined) {
      setDates([null, null]);
    } 
    from_bool ? setDates([d, dates[1]]) : setDates([dates[0], d]);  // There is a latency...
    setDate(d); // Local State
  };

  return (
    <div className="search">
      <p className="word">{word}</p>
        <div style={{marginLeft: 9, marginTop: 5}}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
                inputFormat="MM/DD/YYYY"
                value={date}
                onChange={handleChange}
                renderInput={(params) => <TextField sx={{ // sx is to override MUI styline components...
                  width: "97%",
                  '& .MuiInputBase-root': {
                    borderRadius: 0.5,
                    height: 34,
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderWidth: 2,
                      borderColor:  "#ccc"
                    },
                    '&:hover fieldset': {
                      borderColor: "#ccc",
                    },
                  },
                  '& .MuiInput-underline:after': {
                    borderBottomColor: "#ccc",
                  },
                }}
                  {...params} />}
              />
          </LocalizationProvider>
        </div>
    </div>
  );
}

export default DateBar;