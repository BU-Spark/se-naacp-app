import React from 'react';
import { Autocomplete, MenuItem, Checkbox, TextField, FormControl, InputLabel } from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Article } from '../../__generated__/graphql';

interface TopicSelectorProps {
    selectedTopics: string[];
    setSelectedTopics: React.Dispatch<React.SetStateAction<string[]>>;
    labelsMasterList: string[];
    locationArticles?: Article[];
}

const TopicSelector: React.FC<TopicSelectorProps> = ({ selectedTopics, setSelectedTopics, labelsMasterList, locationArticles }) => {

    const navigate = useNavigate();

    useEffect(() => {
        // Update the URL with selected topics
        const queryParams = new URLSearchParams();
        selectedTopics.forEach(topic => queryParams.append('topic', topic));
        navigate(`?${queryParams.toString()}`); // Update the URL
    }, [selectedTopics, navigate]); // Add navigate to dependencies


    const handleChange = (event: React.ChangeEvent<{}>, newValue: string[]) => {
        if (newValue.length > 5) { // Check if more than 5 topics are selected
            toast.error("You can only select up to 5 topics."); // Show error toast
        } else {
            setSelectedTopics(newValue);
        }
    };

    const filteredLabelsMasterList = locationArticles 
    ? labelsMasterList.filter(topic => locationArticles.some(article => article.openai_labels === topic)) 
    : labelsMasterList; // Filter topics if locationArticles is present


    const getArticleCount = (topic: string) => {
        return locationArticles?.filter(article => article.openai_labels === topic).length;
    };
    

    return (
            <FormControl fullWidth>
                <ToastContainer />
                <Autocomplete
                    multiple
                    options={filteredLabelsMasterList}
                    value={selectedTopics}
                    onChange={handleChange}
                    renderInput={(params) => (
                        <TextField {...params} label="Select Topics" variant="outlined" />
                    )}
                    renderOption={(props, option, { selected }) => (
                        <li {...props}>
                            <Checkbox checked={selected} />
                            {option} {locationArticles ? `(${getArticleCount(option)})` : ''}                        </li>
                    )}
                />
            </FormControl>
    );
}

export default TopicSelector;