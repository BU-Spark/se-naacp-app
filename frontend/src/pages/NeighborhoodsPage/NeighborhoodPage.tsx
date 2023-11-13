//Libaries
import React, { useContext } from "react";
import dayjs from "dayjs";

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

//Contex
import { TractContext } from "../../contexts/tract_context";
import { ArticleContext } from "../../contexts/article_context";
import { NeighborhoodContext } from "../../contexts/neighborhood_context";
import { LinearProgress, Stack } from "@mui/material";
import { TopicsContext } from "../../contexts/topics_context";
import { Auth0Context } from "@auth0/auth0-react";
import { minDate } from "../../App";
import { maxDate } from "../../App";
const NeighborhoodPage: React.FC = () => {
  //Context
  const { articleData, queryArticleDataType } =
    React.useContext(ArticleContext)!;
  const { tractData, queryTractDataType } = React.useContext(TractContext)!;
  const {
    neighborhoodMasterList,
    neighborhood,
    setNeighborhood,
    queryNeighborhoodDataType,
  } = React.useContext(NeighborhoodContext);
  const [isLoading, setIsLoading] = React.useState(true);
  const { queryTopicsDataType } = React.useContext(TopicsContext);
  const { user } = useContext(Auth0Context);

  React.useEffect(() => {
    queryTopicsDataType("TOPICS_DATA");
    queryTopicsDataType("LABELS_DATA");
    queryNeighborhoodDataType("NEIGHBORHOOD_DATA");
    setNeighborhood("Fenway");
    queryTractDataType("TRACT_DATA", { tract: "010103" });
    queryArticleDataType("ARTICLE_DATA", {
      dateFrom: parseInt(minDate.format("YYYYMMDD")),
      dateTo: parseInt(maxDate.format("YYYYMMDD")),
      area: "010103",
      userId: "1",
    });
  }, []);

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
          <LinearProgress color="secondary" />
        </Stack>
      ) : (
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
            <div className="col-md-5 col-sm-12"></div>
            <div className="col-md-4 col-sm-12">
              <div>
                <DateField title="From" isTopicsPage={false}></DateField>
              </div>
            </div>
          </div>

          <div className="row justify-content-evenly">
            <div className="col-md-4 col-sm-12">
              <h1 className="titles">Tracts</h1>
              <TractsDropDown
                tracts={neighborhoodMasterList![neighborhood!]}
              ></TractsDropDown>
            </div>
            <div className="col-md-8 col-sm-12">
              <h1 className="titles">Map</h1>
              <MapCard></MapCard>
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

          <div className="row justify-content-evenly">
            <div className="col-md-12 col-sm-12">
              <h1 className="titles">Top 5 Topics</h1>
              <FrequencyBarChart num={5} openAI={true}></FrequencyBarChart>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NeighborhoodPage;
