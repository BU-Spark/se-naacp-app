import React from "react";
import "./CensusDropdown.css";

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
const censusListPlaceholder = ['None'];

export default function CensusDropdown({word}) {

    const { currentState, setState } = React.useContext(StateContext);  // Global Context of States
    const { neighborhood, setNeigh } = React.useContext(NeighborhoodContext); // Global Neighborhood

    const [census, setCensus] = React.useState('');
    const [censusList, setCensusList] = React.useState(censusListPlaceholder);

    React.useEffect(() => {
        if (currentState !== undefined) {
            if (currentState.hasOwnProperty('CensusTract')) {
                if (currentState.CensusTract.censusTracts !== 'None') {
                    let data = currentState.CensusTract.censusTracts;
                    let censusList = [];

                    data.forEach((census) => {
                        let temp = census.county.split(',');
                        if( !(censusList.indexOf(temp[0]) > -1) ) {
                            censusList.push(temp[0]);
                        } 
                    });

                    setCensusList(censusList);
                }
            }
        }
    },[currentState]);

    const handleChange = (event) => {
        // let original = event.target.value;
        // original = original.toLowerCase().replaceAll(' ', '_');
        // let newState = stateMethods.updateModified(stateMethods.modify(currentState, "currentNeigh", `${original}`));
        // setState(newState);

        // setNeigh(original);
        setCensus(event.target.value);
    };

    return(
    <div className="search">
        <p className="word">{word}</p>
        <FormControl sx={{ m: 1, minWidth: 120, marginTop: 0.90}}>
            <Select
            style={{height: "32px", borderRadius: 0}}
            value={census}
            onChange={handleChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
            >
                {censusList.map( (v) => {
                    return (
                        <MenuItem key={uniqid()} value={v}>{v}</MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    </div>
    );
}