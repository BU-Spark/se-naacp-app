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
import "./NeighborhoodPage.css";
// import "font-awesome/css/font-awesome.min.css";

//Contex
import { TractContext } from "../../contexts/tract_context";
import { ArticleContext } from "../../contexts/article_context";
import { NeighborhoodContext } from "../../contexts/neighborhood_context";
import { LinearProgress, Stack } from "@mui/material";
import { TopicsContext } from "../../contexts/topics_context";

const NeighborhoodPage: React.FC = () => {
  const minDate = dayjs("2020-11-01");
  const maxDate = dayjs("2023-01-09");

  //Context
  const { articleData, queryArticleDataType } =
    React.useContext(ArticleContext)!;
  const { tractData, queryTractDataType } = React.useContext(TractContext)!;
  const {
    neighborhoodMasterList,
    queryNeighborhoodDataType,
    neighborhood,
    setNeighborhood,
  } = React.useContext(NeighborhoodContext)!;
  const { topicsMasterList, queryTopicsDataType, setTopic, topic } =
    React.useContext(TopicsContext)!;

  //States
  const [demographics, setDemographics] = React.useState<Demographics | null>(
    null
  );
  const [isLoading, setIsLoading] = React.useState(true);

  // Setting Deafult Values
  React.useEffect(() => {
    queryNeighborhoodDataType("NEIGHBORHOOD_DATA");
    setNeighborhood("Fenway");
    queryTractDataType("TRACT_DATA", { tract: "010103" });
    queryArticleDataType("ARTICLE_DATA", {
      dateFrom: parseInt(minDate.format("YYYYMMDD")),
      dateTo: parseInt(maxDate.format("YYYYMMDD")),
      area: "010103",
    });
  }, []);

  //To change demographics when a tract is changed
  React.useEffect(() => {
    if (tractData) {
      setDemographics(tractData.demographics);
    }
  }, [tractData]);

  // Check if everything is loaded up if yes show the page if not loading screen
  React.useEffect(() => {
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

  return (
    <>
      <div className="big-container">
        <div className="row">
          <div className="col">
            <div className="align-self-start your-org">
              SELECTED NEIGHBORHOOD
            </div>
            <div className="align-self-start org-name">{neighborhood}</div>
            <h1></h1>
          </div>
        </div>

        <div className="row justify-content-evenly">
          <div className="col-md-3 col-sm-12">
            <SearchBarDropDown
              title="Neighborhoods"
              listOfWords={Object.keys(neighborhoodMasterList!)}
            ></SearchBarDropDown>
          </div>
          <div className="col-md-5 col-sm-12">
           
          </div>
          <div className="col-md-4 col-sm-12">
            <div>
            <DateField
              title="From"
              minDate={minDate}
              maxDate={maxDate}
              isFrom={true}
            ></DateField>
            </div>
          </div>
        </div>

        <div className="row justify-content-evenly">
          <div className="col-md-3 col-sm-12">
            <h1 className="titles">Tracts</h1>
            <TractsDropDown
              tracts={neighborhoodMasterList![neighborhood!]}
            ></TractsDropDown>
          </div>
          <div className="col-md-5 col-sm-12">
            <h1 className="titles">Map</h1>
            <MapCard></MapCard>
          </div>

          <div className="col-md-4 col-sm-12">
            <h1 className="titles">Demographics</h1>
            <NeighborhoodDemographicsBoard
              demographics={demographics}
            ></NeighborhoodDemographicsBoard>
          </div>
        </div>

        <div className="row justify-content-evenly">
          <div className="col-md-5 col-sm-12">
            <h1 className="titles">Top 5 Topics</h1>
            <FrequencyBarChart
              articles={articleData}
              num={5}
              openAI={false}
            ></FrequencyBarChart>
          </div>
          <div className="col-md-7 col-sm-12">
            <h1 className="titles">Articles</h1>

            <ArticleCard articles={articleData}></ArticleCard>
          </div>
        </div>
      </div>
    </>
  );
};

export default NeighborhoodPage;
