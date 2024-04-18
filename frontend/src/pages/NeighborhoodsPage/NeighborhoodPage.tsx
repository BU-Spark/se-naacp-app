//Libaries
import React, { useContext, useState } from "react";

//Components
import ArticleCard from "../../components/ArticleCard/ArticleCard";
import FrequencyBarChart from "../../components/FrequencyBarChart/FrequencyBarChart";
import NeighborhoodDemographicsBoard from "../../components/NeighborhoodDemoBoard/NeighborhoodDemoBoard";
import TractsDropDownSmall from "../../components/TractsDropDownSmall/TractsDropDownSmall";
import TractsDropDown from "../../components/TractsDropDown/TractsDropDown";
import MapCard from "../../components/MapCard/MapCard";
import SearchBarDropDown from "../../components/SearchFields/SearchBarDropdown/SearchBarDropdown";
import DateField from "../../components/SearchFields/DateBar/DateBar";
import AtGlance from "../../components/AtGlance/atGlance";
import Button from "@mui/material/Button";

//CSS
import "./NeighborhoodPage.css";

//Context
import { TractContext } from "../../contexts/tract_context";
import { ArticleContext } from "../../contexts/article_context";
import { NeighborhoodContext } from "../../contexts/neighborhood_context";
import { LinearProgress, Stack } from "@mui/material";
import { TopicsContext } from "../../contexts/topics_context";
import { useOrganization, useUser } from "@clerk/clerk-react";
import { minDate, maxDate } from "../../App";
import TopThreeDemographics from "../../components/TopThreeDemographics/TopThreeDemographics";
import { useLocation } from "react-router-dom";

const NeighborhoodPage: React.FC = () => {
	//Context
	const { articleData, queryArticleDataType } = useContext(ArticleContext)!;
	const { articleData2, queryArticleDataType2 } = useContext(ArticleContext)!;
	const { tractData, queryTractDataType } = useContext(TractContext)!;
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

	// select bar data
	const [selectBarData, setSelectBarData] = useState(null);

	const [ tractInfo, setTractInfo ] = useState('');
	const [ neighborhoodInfo, setNeighborhoodInfo ] = useState('');

	const location = useLocation();

	// handle click
	const clickHandler = (barData: any) => {
		setSelectBarData(barData);
	}

	React.useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tract = queryParams.get('tract');
		const neighborhood = queryParams.get('neighborhood');
        if (tract) {
            // Perform actions based on tract, e.g., fetching data, displaying info, etc.
            console.log(`Tract selected: ${tract}`);
			setTractInfo(tract);
			setNeighborhoodInfo(neighborhood!);
        }
    }, [location]);

	
	React.useEffect(() => {
		queryTopicsDataType("TOPICS_DATA");
		queryTopicsDataType("LABELS_DATA");
		queryNeighborhoodDataType("NEIGHBORHOOD_DATA");
		if (neighborhoodInfo && tractInfo) {
			setNeighborhood(neighborhoodInfo);
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
		}
		else {
			setNeighborhood("Downtown");
			queryTractDataType("TRACT_DATA", { tract: "030302" });
			if (organization) {
				queryArticleDataType("ARTICLE_DATA", {
					dateFrom: parseInt(minDate.format("YYYYMMDD")),
					dateTo: parseInt(maxDate.format("YYYYMMDD")),
					area: '030302',
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
					area: '030302',
					userId: user?.id,
				});
				queryArticleDataType2("ARTICLE_DATA", {
					dateFrom: parseInt(minDate.format("YYYYMMDD")),
					dateTo: parseInt(maxDate.format("YYYYMMDD")),
					area: "all",
					userId: user?.id,
				});
			}
		}
		
	}, [tractInfo, neighborhoodInfo]);

	React.useEffect(() => {
		if (articleData && tractData && neighborhoodMasterList) {
			setIsLoading(false);
		}
	}, [articleData, tractData, neighborhoodMasterList]);

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
				<div className='big-container'>
					<div className='row'>
						<div className='align-self-start org-name'>
									Explore Neighborhoods
						</div>
						
						<div className='col d-flex justify-content-start'>
							<div className='col-md-3 col-sm-12'>
								<SearchBarDropDown
									title='Neighborhoods'
									listOfWords={Object.keys(
										neighborhoodMasterList!,
									)}
								></SearchBarDropDown>
							</div>

							<div className='col-md-3 col-sm-12'>
								<TractsDropDownSmall
									tracts={neighborhoodMasterList![neighborhood!]}
								></TractsDropDownSmall>
							</div>
						</div>
						
						<div className='col d-flex justify-content-end'>
							<div className='col-md-5 col-sm-12'>
								<div>
									<DateField
										title='From'
										isTopicsPage={false}
									></DateField>
								</div>
							</div>
						</div>
					</div>

					{/* <div className="col-md-12 col-sm-12">
						<AllNeighborhoodsBar
						articles={articleData2!}
						height="15vh"
						></AllNeighborhoodsBar>
					</div> */}

					<div className="row justify-content-evenly">
						<div className="col-md-4 col-sm-12">
							<AtGlance articles={articleData!} height="15vh"></AtGlance>
							<TopThreeDemographics articles={articleData!} height="30vh"></TopThreeDemographics>							
						</div>
						<div className='col-md-8 col-sm-12'>
							<MapCard clickable={true}></MapCard>
						</div>
						{/* <div className="col-md-8 col-sm-12">
							<TopNeighborhoods
							articles={articleData!}
							height="15vh"
							></TopNeighborhoods>
						</div> */}
					</div>

					{/* <div className='row justify-content-evenly'>
						<div className='col-md-4 col-sm-12'>
							<h1 className='titles'>Tracts</h1>
							<TractsDropDown
								tracts={neighborhoodMasterList![neighborhood!]}
							></TractsDropDown>
						</div>
					</div> */}
					

					<div className='row justify-content-evenly'>
						<div className='col-md-12 col-sm-12'>
								<h1 className='titles'>Top 5 Topics</h1>
								<FrequencyBarChart
									num={5}
									openAI={true}
									onBarClick={clickHandler} 
								></FrequencyBarChart>
						</div>	
					</div>
					
					<div className='row justify-content-evenly'>
						<div className='col-md-12 col-sm-12'>
							<div className='title-reset'>
								<div><h1 className='titles'>Articles</h1></div>
								<div className='reset-button'>
									<Button
										variant="outlined"
										size="small"
										onClick={() =>
											setSelectBarData(null)}>
												Reset Filter
									</Button>
								</div>
							</div>
							<ArticleCard selectBarData={selectBarData} />
						</div>
					</div>

					<div className='row justify-content-evenly'>
						<div className='col-md-12 col-sm-12'>
							<h1 className='titles'>Demographics</h1>
							<NeighborhoodDemographicsBoard></NeighborhoodDemographicsBoard>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default NeighborhoodPage;
