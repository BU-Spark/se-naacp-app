import React, { useState } from "react";
import "./SearchBar.css";
import DateRangeIcon from '@mui/icons-material/DateRange';
import CloseIcon from "@mui/icons-material/Close";
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

function DateBar({ word, placeholder, data }) {
  const [value, setValue] = React.useState(null)

  return (
    <div className="search">
    <p className="word">{word}</p>
      <div className="searchInputs">
        <DatePicker
          selected={value}
          onChange={date => setValue(date)}
        />
        <div className="dateIcon-r">
            <DateRangeIcon fontSize="medium"/>
        </div>
      </div>
    </div>
  );
}

export default DateBar;