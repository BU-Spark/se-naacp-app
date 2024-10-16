//Libaries
import React from "react";

//Components
import ArticleCard from "../../../components/ArticleCard/ArticleCard";
import NeighborhoodDemographicsBoard from "../../../components/NeighborhoodDemoBoard/NeighborhoodDemoBoard";
import TractsDropDown from "../../../components/TractsDropDown/TractsDropDown";
import MapCard from "../../../components/MapCard/MapCard";
import { LinearProgress, Stack } from "@mui/material";

//Types
import { Article } from "../../../__generated__/graphql";

//CSS
import "./TopicsPage.css";
import "@fortawesome/fontawesome-free/css/all.css";

//Context
import { TractContext } from "../../../contexts/tract_context";
import { ArticleContext } from "../../../contexts/article_context";
import { NeighborhoodContext } from "../../../contexts/neighborhood_context";
import { TopicsContext } from "../../../contexts/topics_context";
import { useNavigate, useLocation } from "react-router-dom";
import DateField from "../../../components/SearchFields/DateBar/DateBar";
import { maxDate, minDate } from "../../../App";
import { useOrganization, useUser } from "@clerk/clerk-react";

function getNeighborhood(
	code: string,
	neighborhoods: { [key: string]: string[] },
): string | null {
	for (let [neighborhoodName, codes] of Object.entries(neighborhoods)) {
		if (codes.includes(code)) {
			return neighborhoodName;
		}
	}
	return "";
}

function countArticlesByKeyWord(
	articles: Article[],
	positionSection: string,
	listOfTopics: string[] | undefined, 
	neighborhoods: { [key: string]: string[] },
) {
	let counts: any = {};
	articles.forEach((article) => {
		if (listOfTopics && listOfTopics.indexOf(positionSection) == -1) {
			if (
				article.openai_labels === positionSection &&
				article.tracts
			) {
				article.tracts.forEach((tract) => {
					counts[tract] = (counts[tract] || 0) + 1;
				});
			}
		} 
	});

	let sortedCounts = Object.entries(counts).sort(
		(a: any, b: any) => b[1] - a[1],
	);
	return getDisplayTractList(sortedCounts, neighborhoods);
}

function getDisplayTractList(
	countOfTract: [string, unknown][],
	neighborhoods: { [key: string]: string[] },
) {
	const result: string[] = [];

	countOfTract.forEach((element) => {
		let neighborhoodName = getNeighborhood(element[0], neighborhoods);
		if (neighborhoodName === "") {
			neighborhoodName = "Greater Boston"; // Set neighborhood name to "Greater Boston" if it's not found
		}
		result.push(
			`${neighborhoodName} - ${element[0]} - ${element[1]}`,
		);
	});

	return result;
}

function extractNeighborhoodTract(text: string) {
	const match = /([\w\s]+ - )?(\d+)/.exec(text);
	let location = "";
	let number = "";

	if (match) {
		location = match[1] ? match[1].slice(0, -3) : ""; // Remove trailing ' - ' from the location
		number = match[2];
	}


	return [location, number];
}

const TopicsPage: React.FC = () => {
	const navigate = useNavigate(); // Initialize useNavigate hook
	const location = useLocation(); // Initialize useLocation hook

	//Context
	const {
		articleData,
		articleData2,
		queryArticleDataType,
		setShouldRefresh,
		shouldRefresh,
		queryArticleDataType2
	} = React.useContext(ArticleContext)!;
	const { topicsMasterList, topic, setTopic, queryTopicsDataType } =
	React.useContext(TopicsContext)!;
	const { tractData, queryTractDataType } = React.useContext(TractContext)!;
	const { neighborhoodMasterList, setNeighborhood, neighborhood, queryNeighborhoodDataType } =
		React.useContext(NeighborhoodContext)!;
	
	const { user } = useUser();
	const { organization } = useOrganization();

	//State
	const [tracts, setTracts] = React.useState<string[]>([]);
	const [flag, setFlag] = React.useState(true);
	const [currentTopic, setcurrentTopic] = React.useState("");
	const [isLoading, setIsLoading] = React.useState(true);


	function handleBoxClick() {
		navigate("../TopicsSearchPage"); // Navigate to the new route
	}

	React.useEffect(() => {
		if (!neighborhoodMasterList) {
			queryNeighborhoodDataType("NEIGHBORHOOD_DATA");
			queryTopicsDataType("TOPICS_DATA", {
				userId: user?.id,
			});
			queryTopicsDataType("LABELS_DATA", {
				userId: user?.id,
			});
		}

	  }, []);


	React.useEffect(() => {
		const queryParams = new URLSearchParams(location.search);
		const urlTopic = queryParams.get("topic");
	
		if (topic) {
			// If there is a topic in the context, update the URL with this topic
			if (urlTopic !== topic) {
				queryParams.set("topic", topic);
				navigate({
					pathname: location.pathname,
					search: queryParams.toString()
				});
			}
		} else if (urlTopic) {
			// If no topic in context but there is one in the URL, set it as the current topic
			setTopic(urlTopic);
		} else {
			// If no topic in context and URL, redirect to the search topic page
			navigate("../TopicsSearchPage");
		}
	}, [location, navigate, topic, setTopic]);

	// Setting Default Values
	React.useEffect(() => {
		if (topic) {
			setShouldRefresh(true);
			if (organization) {
				queryArticleDataType("ARTICLE_BY_LABEL_OR_TOPIC", {
					dateFrom: parseInt(minDate.format("YYYYMMDD")),
					dateTo: parseInt(maxDate.format("YYYYMMDD")),
					area: "all",
					labelOrTopic: topic,
					userId: organization.id,
				});
			} else {
				queryArticleDataType("ARTICLE_BY_LABEL_OR_TOPIC", {
					dateFrom: parseInt(minDate.format("YYYYMMDD")),
					dateTo: parseInt(maxDate.format("YYYYMMDD")),
					area: "all",
					labelOrTopic: topic,
					userId: user?.id,
				});
			}
		}
	}, [topic]);

	//Set deafult count and list
	React.useEffect(() => {
		if (articleData && shouldRefresh) {
			const countTemp = countArticlesByKeyWord(
				articleData!,
				topic!,
				topicsMasterList!,
				neighborhoodMasterList!,
			);

			const extra = extractNeighborhoodTract(countTemp[0]);

			queryTractDataType("TRACT_DATA", {
				tract: extra[1],
			});

			setNeighborhood(extra[0]);
			setTracts(countTemp);
		}
	}, [articleData, shouldRefresh]);

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
		  <div className="big-container">
			<div className="row justify-content-between">
			  <div className="col-md-9 col-sm-12">
				<div className="align-self-start org-back" onClick={handleBoxClick}>
				  <i className="fa fa-arrow-left" aria-hidden="true" style={{ marginRight: "10px" }}></i>
				  Back to Search Page
				</div>
	  
				<div className="align-self-start your-org">
				  SELECTED TOPIC
				</div>
				<div className="align-self-start org-name">
				  {topic == null ? "No Topic Selected" : topic}
				</div>
				<h1></h1>
			  </div>
	  
			  <div className="col-md-3 col-sm-12">
				<div>
				  <DateField title="From" isTopicsPage={true}></DateField>
				</div>
			  </div>
			</div>
	  
			{articleData && topic && neighborhood && tractData && neighborhoodMasterList ? (
			  <>
				<div className="row justify-content-evenly">
				  <div className="col-md-5 col-sm-12">
					<h1 className="titles">Tracts</h1>
					<TractsDropDown tracts={tracts}></TractsDropDown>
				  </div>
				  <div className="col-md-7 col-sm-12">
					<h1 className="titles">Map</h1>
					<MapCard clickable={false}></MapCard>
				  </div>
				</div>
	  
				<div className="row justify-content-evenly">
				  <div className="col-md-5 col-sm-12">
					<h1 className="titles">Demographics</h1>
					<NeighborhoodDemographicsBoard></NeighborhoodDemographicsBoard>
				  </div>
				  <div className="col-md-7 col-sm-12">
					<h1 className="titles">Articles</h1>
					<ArticleCard></ArticleCard>
				  </div>
				</div>
			  </>
			) : (
			  <div className="row justify-content-evenly">
				<div className="col-md-5 col-sm-12">
				  <h1 className="titles">Tracts</h1>
				  <div>No articles in this date range</div>
				</div>
				<div className="col-md-5 col-sm-12">
				</div>
			  </div>
			)}
		  </div>
		)}
		</>
	  );
	  };
	  
export default TopicsPage;
