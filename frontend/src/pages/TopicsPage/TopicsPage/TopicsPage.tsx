//Libaries
import React from "react";
import dayjs from "dayjs";

//Components
import ArticleCard from "../../../components/ArticleCard/ArticleCard";
import NeighborhoodDemographicsBoard from "../../../components/NeighborhoodDemoBoard/NeighborhoodDemoBoard";
import TractsDropDown from "../../../components/TractsDropDown/TractsDropDown";
import MapCard from "../../../components/MapCard/MapCard";

//Types
import { Article, Demographics } from "../../../__generated__/graphql";

//CSS
import "./TopicsPage.css";
import "@fortawesome/fontawesome-free/css/all.css";

//Contex
import { TractContext } from "../../../contexts/tract_context";
import { ArticleContext } from "../../../contexts/article_context";
import { NeighborhoodContext } from "../../../contexts/neighborhood_context";
import { LinearProgress, Stack } from "@mui/material";
import { TopicsContext } from "../../../contexts/topics_context";
import { useNavigate } from "react-router-dom";

function getNeighborhood(
  code: string,
  neighborhoods: { [key: string]: string[] }
): string | null {
  for (let [neighborhoodName, codes] of Object.entries(neighborhoods)) {
    if (codes.includes(code)) {
      return neighborhoodName;
    }
  }
  return null;
}

function countArticlesByKeyWord(
  articles: Article[],
  positionSection: string,
  listOfTopics: string[],
  neighborhoods: { [key: string]: string[] }
) {
  let counts: any = {};
  articles.forEach((article) => {
    if (listOfTopics.indexOf(positionSection) == -1) {
      if (article.openai_labels[0] === positionSection && article.tracts) {
        article.tracts.forEach((tract) => {
          counts[tract] = (counts[tract] || 0) + 1;
        });
      }
    } else {
      if (article.position_section === positionSection && article.tracts) {
        article.tracts.forEach((tract) => {
          counts[tract] = (counts[tract] || 0) + 1;
        });
      }
    }
  });

  let sortedCounts = Object.entries(counts).sort(
    (a: any, b: any) => b[1] - a[1]
  );
  return getDisplayTractList(sortedCounts, neighborhoods);
}

function getDisplayTractList(
  countOfTract: [string, unknown][],
  neighborhoods: { [key: string]: string[] }
) {
  const result: string[] = [];

  countOfTract.forEach((element) => {
    result.push(
      `${getNeighborhood(element[0], neighborhoods)} - ${element[0]} - ${
        element[1]
      }`
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

  function handleBoxClick() {
    navigate("../TopicsSearchPage"); // Navigate to the new route
  }

  //Contex
  const { articleData, queryArticleDataType } =
    React.useContext(ArticleContext)!;
  const { tractData, queryTractDataType } = React.useContext(TractContext)!;
  const { neighborhoodMasterList, setNeighborhood, neighborhood } =
    React.useContext(NeighborhoodContext)!;
  const { topicsMasterList, topic, setTopic } =
    React.useContext(TopicsContext)!;

  //State
  const [tracts, setTracts] = React.useState<string[]>([]);
  const [counter, setCounter] = React.useState(0);

  // Setting Default Values
  React.useEffect(() => {
    if (topic) {
      queryArticleDataType("ARTICLE_BY_LABEL_OR_TOPIC", {
        area: "all",
        labelOrTopic: topic,
        userId: "1",
      });
    }
  }, [topic]);

  //Set deafult count and list
  React.useEffect(() => {
    if (articleData && counter === 1) {
      const countTemp = countArticlesByKeyWord(
        articleData!,
        topic!,
        topicsMasterList!,
        neighborhoodMasterList!
      );

      const extra = extractNeighborhoodTract(countTemp[0]);

      queryTractDataType("TRACT_DATA", {
        tract: extra[1],
      });
      setNeighborhood(extra[0]);
      setTracts(countTemp);
    }
    if (counter === 0) {
      setCounter(1);
    }
  }, [articleData]);

  //Sets new Articles when tract changes
  React.useEffect(() => {
    if (tractData && topic && neighborhood && counter != 0) {
      queryArticleDataType("ARTICLE_BY_LABEL_OR_TOPIC", {
        area: tractData.tract,
        labelOrTopic: topic,
        userId: "1",
      });
      setCounter(-1);
    }
  }, [tractData]);

  return (
    <>
      {!(
        articleData &&
        topic &&
        neighborhood &&
        tractData &&
        neighborhoodMasterList
      ) ? (
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
          <div className="row justify-content-between">
            <div className="col-md-5 col-sm-12">
              <div
                className="align-self-start org-back"
                onClick={handleBoxClick}
              >
                {" "}
                <i
                  className="fa fa-arrow-left"
                  aria-hidden="true"
                  style={{ marginRight: "10px" }}
                ></i>
                Back to Search Page
              </div>

              <div className="align-self-start your-org">SELECTED TOPIC</div>
              <div className="align-self-start org-name">
                {topic == null ? "No Topic Selected" : topic}
              </div>
              <h1></h1>
            </div>
          </div>

          <div className="row justify-content-evenly">
            <div className="col-md-5 col-sm-12">
              <h1 className="titles">Tracts</h1>
              <TractsDropDown tracts={tracts}></TractsDropDown>
            </div>
            <div className="col-md-7 col-sm-12">
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
        </div>
      )}
    </>
  );
};

export default TopicsPage;