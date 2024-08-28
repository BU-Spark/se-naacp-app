import React, { useContext } from "react";
import { MenuProps } from "antd";
import { Menu } from "antd";
import { LocationContext } from "../../contexts/location_context";
import { Locations } from "../../__generated__/graphql";
import { Card, CardContent } from "@mui/material"; 
import { Input } from "antd"; // Import Input for search bar




type MenuItem = Required<MenuProps>["items"][number];

interface LocationsDropDownProps {
    setSelectedLocation: (location: Locations) => void;
    selectedLocation: Locations | null;
}

const LocationsDropDown: React.FC<LocationsDropDownProps> = ({ selectedLocation, setSelectedLocation }) => {
    const { locationsData } = useContext(LocationContext)!;
    const [searchTerm, setSearchTerm] = React.useState(""); // State for search term



    const filteredItems: MenuItem[] = locationsData?.filter(location => 
        location.value.toLowerCase().includes(searchTerm.toLowerCase())
    ).map(location => ({
        key: location.value,
        label: `${location.value} - ${location.articles.length} articles`,
        onClick: () => {
            setSelectedLocation(location);
        },
    })) || [];

    return (
        <Card sx={{ width: "100%", height: "62vh" }}> 
            <CardContent sx={{ width: "100%", height: "62vh" }}>
                <Input 
                    placeholder="Search locations..." // Search bar placeholder
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)} // Update search term
                    style={{ marginBottom: '10px' }} // Spacing for search bar
                />
                <Menu 
                items={filteredItems} 
                style={{ width: "100%", height: "100%", overflow: "auto" }} // Added overflow: 'auto'
                selectedKeys={selectedLocation?.value ? [selectedLocation.value] : []}
                
                
                />
            </CardContent>
        </Card>    
        );
};

export default LocationsDropDown;