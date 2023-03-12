import React from "react";
import "./SearchBar.css";

// MUI UI
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

// Uniqid for unique keys
import uniqid from 'uniqid';

// React Contexts/Context Methods
import { StateContext, StateMethods } from '../../contexts/stateContext.js';

// A Constant...
const neighListPlaceholder = ['None'];

export default function SearchBarDropdown({word}) {

    const { currentState, setState } = React.useContext(StateContext);  // Global Context of States
    const [subneighbor, setSubNeighborhood] = React.useState('');
    const [neighborhoodList, setSubNeighborhoodList] = React.useState(neighListPlaceholder);

    React.useEffect(() => {
      console.log("Universal State: ", currentState);
      if (currentState.v != undefined) {         // Quick and Dirty
        setSubNeighborhoodList(currentState.v);
      }
    },[currentState]);

    const handleChange = (event) => {
        setSubNeighborhood(event.target.value);
    };

    return(
    <div className="search">
        <p className="word">{word}</p>
        <FormControl sx={{ m: 1, minWidth: 120}}>
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