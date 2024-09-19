import React, { useContext, useMemo } from "react";
import { MenuProps } from "antd";
import { Menu } from "antd";
import { LocationContext } from "../../contexts/location_context";
import { Locations } from "../../__generated__/graphql";
import { Card, CardContent } from "@mui/material"; 
import { Input } from "antd"; 
import { debounce } from "lodash";  // Import lodash debounce
import { FixedSizeList as List, ListChildComponentProps } from 'react-window'; // Import react-window for virtualization

type MenuItem = Required<MenuProps>["items"][number];

interface LocationsDropDownProps {
    setSelectedLocation: (location: Locations) => void;
    selectedLocation: Locations | null;
}

const LocationsDropDown: React.FC<LocationsDropDownProps> = ({ selectedLocation, setSelectedLocation }) => {
    const { locationsData } = useContext(LocationContext)!;
    const [searchTerm, setSearchTerm] = React.useState<string>(""); // Add explicit string type

    // Debounced search term update
    const debouncedSetSearchTerm = debounce((value: string) => setSearchTerm(value), 300);

    // Memoized filtered locations
    const filteredItems: Locations[] = useMemo(() => {
        return locationsData?.filter(location =>
            location.value.toLowerCase().includes(searchTerm.toLowerCase())
        ) 
        .sort((a, b) => b.articles.length - a.articles.length) || []; // Sort by article count descending
    }, [locationsData, searchTerm]);

    // Virtualized List Row Component
    const Row = ({ index, style }: ListChildComponentProps) => {
        const location = filteredItems[index];
        const isSelected = selectedLocation?.value === location.value;
        return (
            <div 
            style={{ 
                ...style, 
                backgroundColor: isSelected ? '#e6f7ff' : 'transparent', // Highlight selected item
                padding: '10px',
                color: isSelected ? '#1890ff' : 'black', // Change text color of selected item
            }} 
            onClick={() => setSelectedLocation(location)}
        >
            {location.value} - {location.articles.length} articles
        </div>
        );
    };

    return (
        <Card sx={{ width: "100%", height: "62vh" }}> 
            <CardContent sx={{ width: "100%", height: "62vh" }}>
                <Input 
                    placeholder="Search locations..." 
                    onChange={e => debouncedSetSearchTerm(e.target.value)} 
                    style={{ marginBottom: '10px' }} 
                />
                <List
                    height={450} // Set the height of the virtualized list
                    itemCount={filteredItems.length} // Total items
                    itemSize={45} // Height of each row
                    width={"100%"} // Set width of the list
                >
                    {Row}
                </List>
            </CardContent>
        </Card>    
    );
};

export default LocationsDropDown;
