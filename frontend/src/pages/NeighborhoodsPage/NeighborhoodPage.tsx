import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArticleCard from "../../components/ArticleCard/ArticleCard";
import FrequencyBarChart from "../../components/FrequencyBarChart/FrequencyBarChart";
import NeighborhoodDemographicsBoard from "../../components/NeighborhoodDemoBoard/NeighborhoodDemoBoard";

import { Article, Demographics } from "../../__generated__/graphql";
import "./NeighborhoodPage.css";
import "font-awesome/css/font-awesome.min.css";
import TractsDropDown from "../../components/TractsDropDown/TractsDropDown";
import MapCard from "../../components/MapCard/MapCard";
import { TractContext } from "../../contexts/tract_context";
import { ArticleContext } from "../../contexts/article_context";
const NeighborhoodPage: React.FC = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  // const demographics: Demographics = {
  //   p2_001n: "5722",
  //   p2_002n: "1843",
  //   p2_003n: "3879",
  //   p2_004n: "3559",
  //   p2_005n: "151",
  //   p2_006n: "3209",
  //   p2_007n: "18",
  //   p2_008n: "64",
  //   p2_009n: "0",
  //   p2_010n: "117",
  // };

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
  const dateFrom = 20220101;
  const dateTo = 20220201;
  const tract = "110502";

  var { articleData, queryArticleDataType } = React.useContext(ArticleContext)!;
  var { tractData, queryTractDataType } = React.useContext(TractContext)!;

  var demographics: any = [];
  
  React.useEffect(() => {
    queryArticleDataType("ARTICLE_DATA", {
      dateFrom: dateFrom,
      dateTo: dateTo,
      area: neig,
    });
  }, [articleData]);

  if (!articleData) {
    articleData = [];
  }


  React.useEffect(() => {
    queryTractDataType("TRACT_DATA", {
      tract: tract,
    });
  }, [tractData]);

  if (tractData) {
    demographics = tractData[0].demographics;
  }

  return (
    <>
      <div className="big-container">
        <div className="row">
          <div className="col">
            {/* <div onClick={handleBoxClick}></div> */}

            <div className="align-self-start your-org">
              SELECTED NEIGHBORHOOD
            </div>
            <div className="align-self-start org-name">{"Fenway"}</div>
            <h1></h1>
          </div>
        </div>

        <div className="row justify-content-evenly">
          <div className="col-md-12 col-sm-12"></div>
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
              articles={articleData}
              num={5}
              openAI={false}
            ></FrequencyBarChart>
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

export default NeighborhoodPage;
