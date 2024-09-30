import React, { useContext, useMemo } from "react";
import { Autocomplete } from "@mui/material"; // Import Autocomplete from MUI
import { TextField } from "@mui/material"; // Import TextField from MUI
import { LocationContext } from "../../contexts/location_context";
import { Locations } from "../../__generated__/graphql";

interface LocationsDropDownProps {
    setSelectedLocation: (location: Locations) => void;
    selectedLocation: Locations | null;
}

const LocationsDropDown: React.FC<LocationsDropDownProps> = ({ selectedLocation, setSelectedLocation }) => {
    const { locationsData } = useContext(LocationContext)!;
    const [searchTerm, setSearchTerm] = React.useState<string>("");

    // Memoized filtered locations
    const filteredItems: Locations[] = useMemo(() => {
        return locationsData?.filter(location =>
            location.value.toLowerCase().includes(searchTerm.toLowerCase())
        ) 
        .sort((a, b) => b.articles.length - a.articles.length) || [];
    }, [locationsData, searchTerm]);

    return (
        <div>
            <Autocomplete
                options={filteredItems}
                getOptionLabel={(option) => `${option.value} - ${option.articles.length} Articles`} // Show article count
                onInputChange={(event, newInputValue) => {
                    setSearchTerm(newInputValue);
                }}
                onChange={(event, newValue) => {
                    if (newValue) {
                        setSelectedLocation(newValue);
                    }
                }}
                renderInput={(params) => (
                    <TextField {...params} label="Search locations..." variant="outlined" />
                )}
                style={{ marginBottom: '10px' }} // Style for the autocomplete
            />
            {/* Additional content can go here */}
        </div>
    );
};

export default LocationsDropDown;