import React from 'react';
import { Autocomplete, MenuItem, Checkbox, TextField, FormControl, InputLabel } from "@mui/material";

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface TopicSelectorProps {
    selectedTopics: string[];
    setSelectedTopics: React.Dispatch<React.SetStateAction<string[]>>;
    labelsMasterList: string[];
}

const TopicSelector: React.FC<TopicSelectorProps> = ({ selectedTopics, setSelectedTopics, labelsMasterList }) => {

    const navigate = useNavigate();

    useEffect(() => {
        // Update the URL with selected topics
        const queryParams = new URLSearchParams();
        selectedTopics.forEach(topic => queryParams.append('topic', topic));
        navigate(`?${queryParams.toString()}`); // Update the URL
    }, [selectedTopics, navigate]); // Add navigate to dependencies


    return (
        <FormControl fullWidth>
            
            <Autocomplete
                multiple
                options={labelsMasterList}
                value={selectedTopics}
                onChange={(event, newValue) => {
                    if (newValue.length <= 5) { // Limit to a maximum of 5 topics
                        setSelectedTopics(newValue);
                    }
                }}
                renderInput={(params) => (
                    <TextField {...params} label="Select Topics" variant="outlined" />
                )}
                renderOption={(props, option, { selected }) => (
                    <li {...props}>
                        <Checkbox checked={selected} />
                        {option}
                    </li>
                )}
            />
        </FormControl>
    );
}

export default TopicSelector;