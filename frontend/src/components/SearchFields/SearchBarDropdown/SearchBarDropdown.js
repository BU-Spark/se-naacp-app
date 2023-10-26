import React from "react";
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

// A Constant...
const neighListPlaceholder = ["None"];

export default function SearchBarDropdown({ word }) {
  const { currentState, setState } = React.useContext(StateContext); // Global Context of States
  const { neighborhood, setNeigh } = React.useContext(NeighborhoodContext2); // Global Neighborhood

  const [subneighbor, setSubNeighborhood] = React.useState("");
  const [neighborhoodList, setSubNeighborhoodList] =
    React.useState(neighListPlaceholder);

  React.useEffect(() => {
    // if (neighborhoodMasterList) {
    //   // Quick and Dirty
    //   let cleanedNeighborhoods = neighborhoodMasterList;
    //   for (let i = 0; i < cleanedNeighborhoods.length; i++) {
    //     let nameList = cleanedNeighborhoods[i]
    //       .replaceAll("_", " ")
    //       .split(" ");
    //     let name = "";
    //     nameList.forEach((e) => {
    //       name = name + " " + e.charAt(0).toUpperCase() + e.slice(1);
    //       name = name.trim();
    //     });
    //     cleanedNeighborhoods[i] = name;
    //   }
    //   setSubNeighborhoodList(cleanedNeighborhoods);
    // }

    if (!currentState.hasOwnProperty("currentNeigh")) {
      let newState = stateMethods.updateModified(
        stateMethods.modify(currentState, "currentNeigh", "boston_city")
      );
      setState(newState);
    } else if (currentState.currentNeigh === "") {
      let newState = stateMethods.updateModified(
        stateMethods.modify(currentState, "currentNeigh", "boston_city")
      );
      setState(newState);
    }
  }, [currentState]);
  const minDate = dayjs("2020-11-01"); // November 2020
  const maxDate = dayjs("2023-01-09"); // February 2021
  const { setDates, dates } = React.useContext(DateContext);

  if(dates[0] == null || dates[1] == null){
    setDates([minDate,maxDate]);
  }
  const handleChange = (event) => {
    let original = event.target.value;
    original = original.replaceAll("_", " ");
    let newState = stateMethods.updateModified(
      stateMethods.modify(currentState, "currentNeigh", `${original}`)
    );
    setState(newState);
    setNeigh(original);
    setSubNeighborhood(event.target.value);

  };

  return (
    <div className="search">
      <p className="word">{word}</p>
      <FormControl sx={{ m: 1, minWidth: 120, marginTop: 0.9 }}>
        <Select
          style={{ height: "32px", borderRadius: 0 , backgroundColor: "white"}}
          value={subneighbor}
          onChange={handleChange}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
        >
          <MenuItem value="">
            <em>Select</em>
          </MenuItem>
          {neighborhoodList.map((v) => {
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
}
