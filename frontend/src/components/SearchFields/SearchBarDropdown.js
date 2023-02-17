import React from "react";
import "./SearchBar.css";

// MUI UI
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

// Uniqid for unique keys
import uniqid from 'uniqid';

export default function SearchBarDropdown({word}) {

    const neighList = [
    'brighton', 'allston', 'fenway', 
    'longwood medical area', 'back bay', 
    'beacon hill', 'west end', 'north end', 
    'downtown', 'charlestown', 'east boston', 
    'south boston', 'south boston waterfront', 
    'south end', 'roxbury', 'mission hill', 
    'jamaica plain', 'dorchester', 'mattapan', 
    'roslindale', 'west roxbury', 'hyde park', 
    'harbor islands'];

    const [subneighbor, setSubNeighborhood] = React.useState('');

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
                {neighList.map( (v) => {
                    return (
                        <MenuItem key={uniqid()} value={v}>{v}</MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    </div>
    );
}