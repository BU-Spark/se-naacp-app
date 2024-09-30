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
import TopicCount from '../../components/TopicCount/TopicCount';
import NeighborhoodDemographicsBoard from "../../components/NeighborhoodDemoBoard/NeighborhoodDemoBoard";
import { TractContext } from "../../contexts/tract_context"; // Import TractContext
import LocationInfo from '../../components/LocationsInfo/LocationsInfo'; // Import LocationInfo


const getMostCommonTract = (articles: Article[]) => {
    const tractCount: { [key: string]: number } = {};
    
    articles.forEach(article => {
        article.tracts.forEach(tract => {
            tractCount[tract] = (tractCount[tract] || 0) + 1;
        });
    });

    return Object.keys(tractCount).reduce((a, b) => 
        tractCount[a] > tractCount[b] ? a : b
    );
};


const LocationsPage: React.FC = () => {

    const { locationsData, queryLocationsData } = React.useContext(LocationContext)!;
    const { queryTractDataType } = React.useContext(TractContext)!; // Get query function from TractContext



    const [selectedLocation, setSelectedLocation] = useState<Locations | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [locationArticles, setLocationArticles] = useState<Article[]>([]);
    const [mostCommonTract, setMostCommonTract] = useState<string>("");



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
            const sortedLocations = [...locationsData].sort((a, b) => b.articles.length - a.articles.length);
            setSelectedLocation(sortedLocations[0]);
            params.set('location', sortedLocations[0].value);
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
            setMostCommonTract(getMostCommonTract(newLocationArticles));

    }

        
    },[selectedLocation, articleData2]);

    useEffect(() => {
        queryTractDataType("TRACT_DATA", {
            dateFrom: parseInt(minDate.format("YYYYMMDD")),
            dateTo: parseInt(maxDate.format("YYYYMMDD")),
            tract: mostCommonTract,
        });
       }, [mostCommonTract]);
    
    



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
                        <LocationsDropDown selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation}/>
                        <LocationInfo location={selectedLocation} tract={mostCommonTract} />
                        </div>
                    <div className="col-md-7 col-sm-12">
                         <h1 className="titles">Map</h1>
                            <MapCard clickable={false} coordinates={selectedLocation?.coordinates as [number, number]} />
                    </div>

                    {locationArticles.length > 0 && (
                        <div>
                            <div className="row justify-content-evenly">
                                <div className="col-md-5 col-sm-12">
                                <h1 className="titles"> Topics Count</h1>
                                    <TopicCount articles={locationArticles} />
                                </div>
                                <div className="col-md-7 col-sm-12">
                                    <h1 className="titles">Demographics</h1>
                                    <NeighborhoodDemographicsBoard />
                                </div>
                            </div>
                            <h1 className="titles"> Articles</h1>
                            <ArticleCard optionalArticles={locationArticles} />
                        </div>

                    )}

                </div>

        )}
        </>

    );
}

export default LocationsPage;
