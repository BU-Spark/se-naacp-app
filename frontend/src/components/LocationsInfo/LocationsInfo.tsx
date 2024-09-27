import React from 'react';
import { Locations } from "../../__generated__/graphql";
import { Card, CardContent } from '@mui/material';


interface LocationInfoProps {
    location: Locations | null;
    tract: string;
}

const LocationInfo: React.FC<LocationInfoProps> = ({ location, tract }) => {
    if (!location) {
        return <div>No location selected</div>;
    }

    return (

        <Card sx={{ width: "100%", height: "62vh" }}> 
            <CardContent sx={{ width: "100%", height: "62vh"}} >
                <div>
                    <div><h2>Location Information</h2></div>
                    <div><strong>Location Name:</strong> {location.value}</div>
                    <div><strong>Neighborhood:</strong></div> 
                    <div><strong>Tract:</strong> {tract}</div>
                </div>
            </CardContent>
        </Card> 
    );
};

export default LocationInfo;