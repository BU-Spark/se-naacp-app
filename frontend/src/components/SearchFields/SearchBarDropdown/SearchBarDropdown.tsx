import React from "react";
import "./SearchBarDropdown.css";

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
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
  var {neighborhoodMasterList, neighborhood, setNeighborhood } = React.useContext(NeighborhoodContext)!;
  var {tractData, queryTractDataType } = React.useContext(TractContext)!;

  const [selectedWord, setSelectedWord] = React.useState<string | null>(neighborhood || null);

  const handleChange = (event: React.SyntheticEvent, newValue: string | null) => {
    if (newValue) {
      setNeighborhood(newValue);
      setSelectedWord(newValue);
      queryTractDataType("TRACT_DATA", {tract: neighborhoodMasterList![newValue][0]});
    }
  };

  return (
    <div className="search">
      <Autocomplete
        value={selectedWord}
        onChange={handleChange}
        options={listOfWords}
        renderInput={(params) => <TextField {...params} label={title} />}
        sx={{ width: 250, m: 1, marginTop: 0.9 }}
      />
    </div>
  );
};

export default SearchBarDropDown;
