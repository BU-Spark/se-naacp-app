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
import "font-awesome/css/font-awesome.min.css";

//Contex
import { TractContext } from "../../contexts/tract_context";
import { ArticleContext } from "../../contexts/article_context";
import { NeighborhoodContext } from "../../contexts/neighborhood_context";

const NeighborhoodPage: React.FC = () => {
  const tracts = [
    "010103",
    "010104",
    "010204",
    "010408",
    "010404",
    "010403",
    "981501",
    "010405",
    "010206",
    "010205",
  ];

  const neig = "Fenway";

  const minDate = dayjs("2020-01-01"); // November 2020
  const maxDate = dayjs("2021-01-01"); // February 2021

  const dateTo = 20200101;
  const dateFrom = 20210101;

  const tract = "110502";

  var { articleData, queryArticleDataType } = React.useContext(ArticleContext)!;
  var { tractData, queryTractDataType } = React.useContext(TractContext)!;
  var {
    neighborhoodMasterList,
    queryNeighborhoodDataType,
    neighborhood,
    setNeighborhood,
  } = React.useContext(NeighborhoodContext)!;

  // setNeighborhood("Hey");
  console.log(neighborhood);

  const [articles, setArticles] = React.useState<Article[] | null>(null);
  const [demographics, setDemographics] = React.useState<Demographics | null>(
    null
  );
  const [neighborhoods, setNeighborhoods] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // React.useEffect(() => {
  //   console.log(neighborhood);
  // }, [neighborhood]);
  // queryNeighborhoodDataType("NEIGHBORHOOD_DATA", {});
  console.log()

  React.useEffect(() => {
    queryArticleDataType("ARTICLE_DATA", {
      dateFrom: dateFrom,
      dateTo: dateTo,
      area: neig,
    });
    setArticles(articleData);
  }, [articleData]);

  React.useEffect(() => {
    queryTractDataType("TRACT_DATA", {
      tract: tract,
    });
    if (tractData) {
      setDemographics(tractData.demographics);
    }
  }, [tractData]);

  React.useEffect(() => {
    queryNeighborhoodDataType("NEIGHBORHOOD_DATA", {});
    if (neighborhoodMasterList) {
      setNeighborhoods(neighborhoodMasterList);
      console.log(neighborhoodMasterList);
    }
  }, [neighborhoodMasterList]);

  React.useEffect(() => {
    // Check if all data is available
    if (articleData && tractData && neighborhoodMasterList) {
      setIsLoading(false);
    }
  }, [articleData, tractData, neighborhoodMasterList]);

  if (isLoading) {
    return <p>Hey</p>;
  }

  return (
    <>
      <div className="big-container">
        <div className="row">
          <div className="col">
            <div className="align-self-start your-org">
              SELECTED NEIGHBORHOOD
            </div>
            <div className="align-self-start org-name">{"Fenway"}</div>
            <h1></h1>
          </div>
        </div>

        <div className="row justify-content-evenly">
          <div className="col-md-3 col-sm-12">
            <SearchBarDropDown
              title="Neighborhoods"
              listOfWords={neighborhoods}
            ></SearchBarDropDown>
          </div>
          <div className="col-md-5 col-sm-12">
            <DateField
              title="From"
              minDate={minDate}
              maxDate={maxDate}
              isFrom={true}
            ></DateField>
          </div>

          <div className="col-md-4 col-sm-12">
            <DateField
              title="To"
              minDate={minDate}
              maxDate={maxDate}
              isFrom={false}
            ></DateField>
          </div>
        </div>

        <div className="row justify-content-evenly">
          <div className="col-md-3 col-sm-12">
            <h1 className="titles">Tracts</h1>
            <TractsDropDown tracts={tracts}></TractsDropDown>
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
          <div className="col-md-4 col-sm-12">
            <h1 className="titles">Top 5 Topics</h1>
            <FrequencyBarChart
              articles={articles}
              num={5}
              openAI={false}
            ></FrequencyBarChart>
          </div>
          <div className="col-md-8 col-sm-12">
            <h1 className="titles">Articles</h1>

            <ArticleCard articles={articles}></ArticleCard>
          </div>
        </div>
      </div>
    </>
  );
};

export default NeighborhoodPage;
