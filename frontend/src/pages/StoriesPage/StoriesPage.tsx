//Libaries
import React, { useContext, useState, useEffect } from "react";
import { Tabs, Tab, Box } from '@mui/material';
import dayjs from "dayjs";

//Components
import MapStories from "../../components/MapStories/MapStories";
import DateField from "../../components/SearchFields/DateBar/DateBar";
import ArticleCard from "../../components/ArticleCard/ArticleCard";


//CSS
import "./StoriesPage.css";

//Context
import { TractContext } from "../../contexts/tract_context";
import { ArticleContext } from "../../contexts/article_context";
import { NeighborhoodContext } from "../../contexts/neighborhood_context";
import { LinearProgress, Stack } from "@mui/material";
import { TopicsContext } from "../../contexts/topics_context";
import { useOrganization, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";

const StoriesPage: React.FC = () => {
    
  //Context
  	const { articleData, queryArticleDataType } = useContext(ArticleContext)!;
	const { articleData2, queryArticleDataType2 } = useContext(ArticleContext)!;
	const { tractData, queryTractDataType } = useContext(TractContext)!;

	const minDate = dayjs("2021-01-01");
	const maxDate = dayjs();
	const {
		neighborhoodMasterList,
		neighborhood,
		setNeighborhood,
		queryNeighborhoodDataType,
	} = useContext(NeighborhoodContext);
	const { queryTopicsDataType } = useContext(TopicsContext);

	const [isLoading, setIsLoading] = useState(true);
	const { user } = useUser();
	const { organization } = useOrganization();


	const [ tractInfo, setTractInfo ] = useState('');
	const [ neighborhoodInfo, setNeighborhoodInfo ] = useState('All Neighborhoods');


	const location = useLocation();
	const navigate = useNavigate();

	// handle click

	console.log('neighborhood master list', neighborhoodMasterList)

	useEffect(() => {
			setNeighborhoodInfo("Downtown");
			setNeighborhood("Downtown");
			setTractInfo("030302");
		}, []);

	useEffect(() => {
		queryTopicsDataType("TOPICS_DATA");
		queryTopicsDataType("LABELS_DATA");
		queryNeighborhoodDataType("NEIGHBORHOOD_DATA");
		setNeighborhood(neighborhoodInfo);
		queryTractDataType("TRACT_DATA", { tract: tractInfo });
		if (organization) {
			queryArticleDataType("ARTICLE_DATA", {
				dateFrom: parseInt(minDate.format("YYYYMMDD")),
				dateTo: parseInt(maxDate.format("YYYYMMDD")),
				area: tractInfo,
				userId: organization.id,
			});
			queryArticleDataType2("ARTICLE_DATA", {
				dateFrom: parseInt(minDate.format("YYYYMMDD")),
				dateTo: parseInt(maxDate.format("YYYYMMDD")),
				area: "all",
				userId: organization.id,
			});
		} else {
			queryArticleDataType("ARTICLE_DATA", {
				dateFrom: parseInt(minDate.format("YYYYMMDD")),
				dateTo: parseInt(maxDate.format("YYYYMMDD")),
				area: tractInfo,
				userId: user?.id,
			});
			queryArticleDataType2("ARTICLE_DATA", {
				dateFrom: parseInt(minDate.format("YYYYMMDD")),
				dateTo: parseInt(maxDate.format("YYYYMMDD")),
				area: "all",
				userId: user?.id,
			});
		}
	}, [tractInfo, neighborhoodInfo]);

	useEffect(() => {
		if (articleData && tractData && neighborhoodMasterList) {
			setIsLoading(false);
		}
	}, [articleData, tractData, neighborhoodMasterList]);

    return (
        <div>
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
						
							{/* Stories View content goes here */}
								<MapStories/>
                </div>
            </div>

				
            )}
        </div>
    );
}

export default StoriesPage;