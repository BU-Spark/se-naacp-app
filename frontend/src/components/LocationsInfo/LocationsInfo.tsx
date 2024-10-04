import React from 'react';
import { Locations } from "../../__generated__/graphql";
import { Card, CardContent } from '@mui/material';


interface LocationInfoProps {
    location: Locations | null;
}

const LocationInfo: React.FC<LocationInfoProps> = ({ location }) => {
    if (!location) {
        return <div>No location selected</div>;
    }

    return (

        <Card sx={{ width: "100%", height: "62vh" }}> 
            <CardContent sx={{ width: "100%", height: "62vh"}} >
                <div>
                    <div><h2>Location Information</h2></div>
                    { location.value && (
                    <div><strong>Location Name:</strong> {location.value}</div>
                    )}
                    { location.city && (
                    <div><strong>City:</strong> {location.city}</div>
                    )}
                    { location.neighborhood && (
                    <div><strong>Neighborhood:</strong>{location.neighborhood}</div>
                    )}
                    { location.tract && (
                    <div><strong>Tract:</strong> {location.tract}</div>
                    )}
                </div>
            </CardContent>
        </Card> 
    );
};

export default LocationInfo;