//Libaries
import React, { useContext, useState, useEffect, useInsertionEffect } from "react";
import { LinearProgress, Stack } from "@mui/material";
import { Select, MenuItem, Checkbox, ListItemText } from "@mui/material";
import { FormControl, InputLabel } from "@mui/material";
import { SelectChangeEvent } from '@mui/material';
import { Button } from "@mui/material";


//Components
import MapStories from "../../components/MapStories/MapStories";
import DateField from "../../components/SearchFields/DateBar/DateBar";
import ArticleCard from "../../components/ArticleCard/ArticleCard";
import TopicSelector from "../../components/TopicSelector/TopicSelector"; 


//CSS
import "./StoriesPage.css";

//Context
import { TractContext } from "../../contexts/tract_context";
import { ArticleContext } from "../../contexts/article_context";
import { NeighborhoodContext } from "../../contexts/neighborhood_context";
import { TopicsContext } from "../../contexts/topics_context";
import { LocationContext } from "../../contexts/location_context";
import { useOrganization, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import { minDate, maxDate } from "../../App";

const StoriesPage: React.FC = () => {
    
  //Context
  	const { articleData, queryArticleDataType } = useContext(ArticleContext)!;
	const { articleData2, queryArticleDataType2 } = useContext(ArticleContext)!;
	const { tractData, queryTractDataType } = useContext(TractContext)!;
	const { locationsData, queryLocationsData } = useContext(LocationContext);

	const {
		neighborhoodMasterList,
		neighborhood,
		setNeighborhood,
		queryNeighborhoodDataType,
	} = useContext(NeighborhoodContext);
	const { labelsMasterList, queryTopicsDataType } = useContext(TopicsContext);

	const [isLoading, setIsLoading] = useState(true);
	const { user } = useUser();
	const { organization } = useOrganization();


	const [ tractInfo, setTractInfo ] = useState('');
	const [ neighborhoodInfo, setNeighborhoodInfo ] = useState('All Neighborhoods');

	const [ selectedTopics, setSelectedTopics ] = useState<string[]>([]);
	const [zoom, setZoom] = useState(13);
	const [center, setCenter] = useState<[number, number]>([42.3601, -71.0589]);



	const location = useLocation();
	const navigate = useNavigate();




	useEffect(() => {
			setNeighborhoodInfo("Downtown");
			setNeighborhood("Downtown");
			setTractInfo("030302");
		}, []);

	useEffect(() => {
		const queryParams = new URLSearchParams(location.search);
		const topics = queryParams.getAll('topic');
		setSelectedTopics(topics);
	}, []); // Add location to dependencies

	useEffect(() => {
		if (organization) {
			queryTopicsDataType("LABELS_DATA", {
				userId: organization.id,
			});
		} else {
			queryTopicsDataType("LABELS_DATA", {
				userId: user?.id,
			});
		}
		queryLocationsData();
		queryNeighborhoodDataType("NEIGHBORHOOD_DATA");
		setNeighborhood(neighborhoodInfo);
		queryTractDataType("TRACT_DATA", { tract: tractInfo });
		// if (organization) {
		// 	queryArticleDataType("ARTICLE_DATA", {
		// 		dateFrom: parseInt(minDate.format("YYYYMMDD")),
		// 		dateTo: parseInt(maxDate.format("YYYYMMDD")),
		// 		area: tractInfo,
		// 		userId: organization.id,
		// 	});
		// 	queryArticleDataType2("ARTICLE_DATA", {
		// 		dateFrom: parseInt(minDate.format("YYYYMMDD")),
		// 		dateTo: parseInt(maxDate.format("YYYYMMDD")),
		// 		area: "all",
		// 		userId: organization.id,
		// 	});
		// } else {
		// 	queryArticleDataType("ARTICLE_DATA", {
		// 		dateFrom: parseInt(minDate.format("YYYYMMDD")),
		// 		dateTo: parseInt(maxDate.format("YYYYMMDD")),
		// 		area: tractInfo,
		// 		userId: user?.id,
		// 	});
		// 	queryArticleDataType2("ARTICLE_DATA", {
		// 		dateFrom: parseInt(minDate.format("YYYYMMDD")),
		// 		dateTo: parseInt(maxDate.format("YYYYMMDD")),
		// 		area: "all",
		// 		userId: user?.id,
		// 	});
		// }
	}, [tractInfo, neighborhoodInfo]);




	useEffect(() => {
		if (articleData && tractData && neighborhoodMasterList && articleData2 && locationsData) {
			setIsLoading(false);
		}

	}, [articleData, tractData, neighborhoodMasterList, articleData2]);

	const resetMap = () => {
        setZoom(13); // Reset to initial zoom
        setCenter([42.3601, -71.0589]); // Reset to initial center
        setSelectedTopics([]); // Reset selected topics
    };

    return (
        <div style={{padding:"20px"}}>
            <h1>Stories Page</h1>
			<div className='col d-flex justify-content-end'>
				<div className='col-md-5 col-sm-12'>
					<DateField
						title='From'
						isTopicsPage={false}
					></DateField>
				</div>
			</div>
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
				<div>
                <div className='row'>
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<Button onClick={resetMap} variant="contained" color="primary" sx={{ margin: '10px' }}>
							Reset Map
						</Button>
						<TopicSelector 
                            selectedTopics={selectedTopics} 
                            setSelectedTopics={setSelectedTopics} 
                            labelsMasterList={labelsMasterList ?? []} 
                        />
						
					</div>
		
					<MapStories selectedTopics={selectedTopics} setSelectedTopics={setSelectedTopics} zoom={zoom} setZoom={setZoom} center={center} setCenter={setCenter}/>
                </div>
            </div>

				
            )}
        </div>
    );
}

export default StoriesPage;