import React, { useState } from "react";
import "./SearchBar.css";

// MUI UI
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';


export default function SearchBarDropdown({word}) {

    const [age, setAge] = React.useState('');

    const handleChange = (event) => {
    setAge(event.target.value);
    };

    <div className="search">
        <p className="word">{word}</p>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
            <Select
            value={age}
            onChange={handleChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
            >
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
            </Select>
        </FormControl>
    </div>
}