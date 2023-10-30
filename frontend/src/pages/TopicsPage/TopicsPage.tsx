//Libaries
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { useState, CSSProperties } from "react";

//Components
import ArticleCard from "../../components/ArticleCard/ArticleCard";
import FrequencyBarChart from "../../components/FrequencyBarChart/FrequencyBarChart";
import NeighborhoodDemographicsBoard from "../../components/NeighborhoodDemoBoard/NeighborhoodDemoBoard";
import TractsDropDown from "../../components/TractsDropDown/TractsDropDown";
import MapCard from "../../components/MapCard/MapCard";
import SearchBarDropDown from "../../components/SearchFields/SearchBarDropdown/SearchBarDropdown";
import DateField from "../../components/SearchFields/DateBar/DateBar";
//Types
import { Article, Demographics } from "../../__generated__/graphql";

//CSS
import "./TopicsPage.css";
import "font-awesome/css/font-awesome.min.css";

//Contex
import { TractContext } from "../../contexts/tract_context";
import { ArticleContext } from "../../contexts/article_context";
import { NeighborhoodContext } from "../../contexts/neighborhood_context";
import { LinearProgress, Stack } from "@mui/material";
import TopicsSearchBar from "../../components/SearchFields/TopicsSearchBar/TopicsSearchBar";
import { TopicsContext } from "../../contexts/topics_context";

const TopicsPage: React.FC = () => {
  const minDate = dayjs("2020-11-01");
  const maxDate = dayjs("2023-01-09");

  const { articleData, queryArticleDataType } =
    React.useContext(ArticleContext)!;
  const { tractData, queryTractDataType } = React.useContext(TractContext)!;
  const {
    neighborhoodMasterList,
    queryNeighborhoodDataType,
    neighborhood,
    setNeighborhood,
  } = React.useContext(NeighborhoodContext)!;
  const { topicsMasterList, queryTopicsDataType, topic } =
    React.useContext(TopicsContext)!;

  const [demographics, setDemographics] = React.useState<Demographics | null>(
    null
  );
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (tractData) {
      setDemographics(tractData.demographics);
    }
  }, [tractData]);

  React.useEffect(() => {
    // Check if all data is available
    if (articleData && tractData && neighborhoodMasterList) {
      setIsLoading(false);
    }
  }, [articleData, tractData, neighborhoodMasterList]);

  if (isLoading) {
    return (
      <Stack
        sx={{
          width: "100%",
          color: "grey.500",
          marginTop: "10px",
        }}
        spacing={2}
      >
        <LinearProgress color="secondary" />
      </Stack>
    );
  }

  const listOfStrings: string[] = ["Apple", "Banana", "Cherry", "Date", "Fig"];

  return (
    <>
      <div className="big-container">
        <div className="row justify-content-between">
          <div className="col-md-5 col-sm-12">
            <div className="align-self-start your-org">SELECTED TOPIC</div>
            <div className="align-self-start org-name">
              {topic == null ? "No Topic Selected" : topic}
            </div>
            <h1></h1>
          </div>
          <div className="col-md-7 col-sm-12 search-bar">
            <TopicsSearchBar listOfWords={topicsMasterList!}></TopicsSearchBar>
          </div>
        </div>

        <div className="row justify-content-evenly">
          {/* <div className="col-md-12 col-sm-12">
            <TopicsSearchBar listOfWords={topicsMasterList!}></TopicsSearchBar>
          </div> */}
        </div>

        <div className="row justify-content-evenly">
          <div className="col-md-5 col-sm-12">
            <h1 className="titles">Tracts</h1>
            <TractsDropDown
              tracts={neighborhoodMasterList![neighborhood!]}
            ></TractsDropDown>
          </div>
          <div className="col-md-7 col-sm-12">
            <h1 className="titles">Map</h1>
            <MapCard></MapCard>
          </div>
        </div>

        <div className="row justify-content-evenly">
          <div className="col-md-4 col-sm-12">
            <h1 className="titles">Demographics</h1>
            <NeighborhoodDemographicsBoard
              demographics={demographics}
            ></NeighborhoodDemographicsBoard>
          </div>
          <div className="col-md-8 col-sm-12">
            <h1 className="titles">Articles</h1>

            <ArticleCard articles={articleData}></ArticleCard>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopicsPage;
