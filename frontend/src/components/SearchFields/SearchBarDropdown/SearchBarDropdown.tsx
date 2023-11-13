import React, { useState } from "react";
import "./SearchBarDropdown.css";

// MUI UI
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

// Uniqid for unique keys
import uniqid from "uniqid";

// Context
import { NeighborhoodContext } from "../../../contexts/neighborhood_context";
import { TractContext } from "../../../contexts/tract_context";

interface SearchBarDropDownPros {
  listOfWords: string[];
  title: string;
}

const SearchBarDropDown: React.FC<SearchBarDropDownPros> = ({
  listOfWords,
  title,
}) => {
  var {neighborhoodMasterList,neighborhood, setNeighborhood } = React.useContext(NeighborhoodContext)!;
  var {tractData, queryTractDataType } = React.useContext(TractContext)!;

  const [selectedWord, setSelectedWord] = React.useState<string>(neighborhood!);
 

  const handleChange = (event: any) => {
    setNeighborhood(event.target.value);
    setSelectedWord(event.target.value);
    queryTractDataType("TRACT_DATA", {tract: neighborhoodMasterList![event.target.value][0]});
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
