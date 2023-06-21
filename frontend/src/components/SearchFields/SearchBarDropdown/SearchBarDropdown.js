import React from "react";
import "./SearchBarDropdown.css";

// MUI UI
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

// Uniqid for unique keys
import uniqid from 'uniqid';

// React Contexts/Context Methods
import { StateContext, stateMethods } from '../../../contexts/stateContext.js';
import { NeighborhoodContext } from '../../../contexts/neighborhoodContext.js';

// A Constant...
const neighListPlaceholder = ['None'];

export default function SearchBarDropdown({word}) {

    const { currentState, setState } = React.useContext(StateContext);  // Global Context of States
    const { neighborhood, setNeigh } = React.useContext(NeighborhoodContext); // Global Neighborhood

    const [subneighbor, setSubNeighborhood] = React.useState('');
    const [neighborhoodList, setSubNeighborhoodList] = React.useState(neighListPlaceholder);

    React.useEffect(() => {
      if (currentState.hasOwnProperty('Subneighborhoods')) {         // Quick and Dirty
        let cleanedNeighborhoods = stateMethods.updateModified(currentState.Subneighborhoods);
        for (let i = 0; i < cleanedNeighborhoods.length; i++) {
            let nameList = cleanedNeighborhoods[i].neighborhood.replaceAll('_', ' ').split(" ");
            let name = ""
            nameList.forEach((e) => {
                name = name + " " + e.charAt(0).toUpperCase() + e.slice(1);
                name = name.trim();
            });
            cleanedNeighborhoods[i] = name
        }
        setSubNeighborhoodList(cleanedNeighborhoods);
      } 

      if (!currentState.hasOwnProperty('currentNeigh')) {
        let newState = stateMethods.updateModified(stateMethods.modify(currentState, "currentNeigh", "boston_city"));
        setState(newState);
      } else if (currentState.currentNeigh === "") {
        let newState = stateMethods.updateModified(stateMethods.modify(currentState, "currentNeigh", "boston_city"));
        setState(newState);
      }

    },[currentState]);

    const handleChange = (event) => {
        let original = event.target.value;
        original = original.toLowerCase().replaceAll(' ', '_');
        let newState = stateMethods.updateModified(stateMethods.modify(currentState, "currentNeigh", `${original}`));
        setState(newState);

        setNeigh(original);
        setSubNeighborhood(event.target.value);
    };

    return(
    <div className="search">
        <p className="word">{word}</p>
        <FormControl sx={{ m: 1, minWidth: 120, marginTop: 0.90}}>
            <Select
            style={{height: "32px", borderRadius: 0}}
            value={subneighbor}
            onChange={handleChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
            >
                <MenuItem value="">
                    <em>Boston City</em>
                </MenuItem>
                {neighborhoodList.map( (v) => {
                    return (
                        <MenuItem key={uniqid()} value={v}>{v}</MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    </div>
    );
}