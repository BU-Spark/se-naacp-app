import React, { useState } from "react";
import "./SearchBarDropdown.css";
import dayjs from "dayjs";
import { DateContext } from "../../../contexts/dateContext.js";

// MUI UI
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

// Uniqid for unique keys
import uniqid from "uniqid";

// React Contexts/Context Methods
import { StateContext, stateMethods } from "../../../contexts/stateContext.js";
import { NeighborhoodContext2 } from "../../../contexts/neighborhoodContext.js";

// Context
import { ArticleContext } from "../../../contexts/article_context";

interface SearchBarDropDownPros {
  listOfWords: string[];
  title: string;
}

const SearchBarDropDown: React.FC<SearchBarDropDownPros> = ({
  listOfWords,
  title,
}) => {
  const [selectedWord, setSelectedWord] = useState<string>(listOfWords[0]);

  const handleChange = (event: any) => {
    setSelectedWord(event.target.value);
  };

  return (
    <div className="search">
      <p className="word">{title}</p>
      <FormControl sx={{ m: 1, minWidth: 120, marginTop: 0.9 }}>
        <Select
          style={{ height: "32px", borderRadius: 0, backgroundColor: "white" }}
          value={selectedWord}
          onChange={handleChange}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
        >
          {listOfWords.map((v) => {
            return (
              <MenuItem key={uniqid()} value={v}>
                {v}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
};

export default SearchBarDropDown;
