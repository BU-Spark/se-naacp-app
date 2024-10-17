import React from 'react';
import { Locations } from "../../__generated__/graphql";
import { Card, CardContent } from '@mui/material';
import { filter } from 'lodash';


interface LocationInfoProps {
    location: Locations | null;
    filteredArticlesLength: number;
}

const LocationInfo: React.FC<LocationInfoProps> = ({ location, filteredArticlesLength }) => {
    if (!location) {
        return <div>No location selected</div>;
    }

    return (

        <Card sx={{ width: "100%", height: "30vh" }}> 
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
                    { location.articles && (
                        <div><strong>Article Count:</strong> {location.articles.length}</div>
                    )}
                    { filteredArticlesLength !== location.articles.length && (
                        <div><strong>Filtered Article Count:</strong> {filteredArticlesLength}</div>
                    )}

                </div>
            </CardContent>
        </Card> 
    );
};

export default LocationInfo;