import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LocationContext } from "../../contexts/location_context";
import LocationsDropDown from '../../components/LocationsDropDown/LocationsDropDown';
import MapCard from '../../components/MapCard/MapCard';
import { useState } from 'react';
import { Locations } from "../../__generated__/graphql";
import { LinearProgress, Stack } from '@mui/material';
import { ArticleContext } from "../../contexts/article_context";
import { useOrganization, useUser } from "@clerk/clerk-react";
import { minDate, maxDate } from "../../App";
import { Article } from '../../__generated__/graphql';
import ArticleCard from "../../components/ArticleCard/ArticleCard";





const LocationsPage: React.FC = () => {

    const { locationsData, queryLocationsData } = React.useContext(LocationContext)!;


    const [selectedLocation, setSelectedLocation] = useState<Locations | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [locationArticles, setLocationArticles] = useState<Article[]>([]);


    const { articleData,articleData2, queryArticleDataType2 } = React.useContext(ArticleContext)!;

    const { user } = useUser();
    const { organization } = useOrganization();




    
    const navigate = useNavigate(); // Initialize useNavigate hook
	const location = useLocation(); // Initialize useLocation hook

    React.useEffect(() => {
        queryLocationsData();
        if (organization && !articleData2) {
            queryArticleDataType2("ARTICLE_DATA", {
				dateFrom: parseInt(minDate.format("YYYYMMDD")),
				dateTo: parseInt(maxDate.format("YYYYMMDD")),
				area: "all",
				userId: organization.id,
			});
        } else if (user && !articleData2) {
            queryArticleDataType2("ARTICLE_DATA", {
				dateFrom: parseInt(minDate.format("YYYYMMDD")),
				dateTo: parseInt(maxDate.format("YYYYMMDD")),
				area: "all",
				userId: user?.id,
			});
        }
    }, []);

    React.useEffect(() => {
        const params = new URLSearchParams(location.search);
        const locationParam = params.get('location');
        console.log("param",locationParam)
        if (locationParam && locationsData) {
            const foundLocation = locationsData?.find(loc => loc.value === locationParam);
            console.log("foundLocation",foundLocation)
            if (foundLocation) {
                setSelectedLocation(foundLocation);
            }
        } else if (!selectedLocation && locationsData && locationsData.length > 0) {
            console.log("no location in param")
            setSelectedLocation(locationsData[0]);
            params.set('location', locationsData[0].value);
            navigate({ search: params.toString() });
        }
    }, [locationsData]);

    React.useEffect(() => {
        if (locationsData && selectedLocation && articleData2) {
            setIsLoading(false);
            const params = new URLSearchParams(location.search);
            const locationParam = params.get('location');
            if (locationParam !== selectedLocation?.value) {
                console.log("new param set cuz of new location", selectedLocation?.value)
                params.set('location', selectedLocation?.value as string);
                navigate({ search: params.toString() }); 
            }
                const newLocationArticles = articleData2.filter(article => 
                    selectedLocation.articles.includes(article.content_id)
                );                
                setLocationArticles(newLocationArticles);
    }

        
    },[selectedLocation, articleData2]);

    React.useEffect(() => {
        console.log("articleData",articleData)
        console.log("articleData2",articleData2)

    }, [articleData,articleData2]);

    React.useEffect(() => {

        console.log(locationArticles)
    }, [locationArticles]);



    return (
        <>
			{isLoading ? (
				<Stack
					sx={{
						width: "100%",
						color: "grey.500",
						marginTop: "10px",
					}}
					spacing={2}
				>
					<LinearProgress color='secondary' />
				</Stack>
			) : (

                <div className="row justify-content-evenly">
                    <div className="col-md-5 col-sm-12">
                        <h1 className="titles">Locations page</h1>
                        <LocationsDropDown selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation}/>
                        </div>
                    <div className="col-md-7 col-sm-12">
                         <h1 className="titles">Map</h1>
                            <MapCard clickable={false} coordinates={selectedLocation?.coordinates as [number, number]} />
                    </div>

                    {locationArticles.length > 0 && (
                        <ArticleCard optionalArticles={locationArticles} />
                    )}
                </div>

        )}
        </>

    );
}

export default LocationsPage;

