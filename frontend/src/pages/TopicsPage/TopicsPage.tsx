//Libaries
import React from "react";
import dayjs from "dayjs";

//Components
import ArticleCard from "../../components/ArticleCard/ArticleCard";
import NeighborhoodDemographicsBoard from "../../components/NeighborhoodDemoBoard/NeighborhoodDemoBoard";
import TractsDropDown from "../../components/TractsDropDown/TractsDropDown";
import MapCard from "../../components/MapCard/MapCard";

//Types
import { Article, Demographics } from "../../__generated__/graphql";

//CSS
import "./TopicsPage.css";
// import "font-awesome/css/font-awesome.min.css";

//Contex
import { TractContext } from "../../contexts/tract_context";
import { ArticleContext } from "../../contexts/article_context";
import { NeighborhoodContext } from "../../contexts/neighborhood_context";
import { LinearProgress, Stack } from "@mui/material";
import TopicsSearchBar from "../../components/SearchFields/TopicsSearchBar/TopicsSearchBar";
import { TopicsContext } from "../../contexts/topics_context";

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

function countArticlesByTract(articles: Article[], positionSection: string) {
  let counts: any = {};

  articles.forEach((article) => {
    if (article.position_section === positionSection && article.tracts) {
      article.tracts.forEach((tract) => {
        counts[tract] = (counts[tract] || 0) + 1;
      });
    }
  });

  let sortedCounts = Object.entries(counts).sort(
    (a: any, b: any) => b[1] - a[1]
  );
  return sortedCounts;
}

function getArticlesByKeyWord(
  keyword: string,
  articles: Article[],
  tract: string
): Article[] {
  const temp: Article[] = [];

  articles.forEach((element) => {
    if (
      element.position_section === keyword &&
      element.tracts.includes(tract)
    ) {
      temp.push(element);
    }
  });
  return temp;
}

const TopicsPage: React.FC = () => {
  const minDate = dayjs("2020-11-01");
  const maxDate = dayjs("2023-01-09");

  //Contex
  const { articleData, queryArticleDataType } = React.useContext(ArticleContext)!;
  const { tractData, queryTractDataType } = React.useContext(TractContext)!;
  const { neighborhoodMasterList, setNeighborhood} = React.useContext(NeighborhoodContext)!;
  const { topicsMasterList, topic, setTopic } = React.useContext(TopicsContext)!;

  //State
  const [demographics, setDemographics] = React.useState<Demographics | null>(null);
  const [articles, setArticles] = React.useState<Article[]>([]);
  const [masterArticles, setMasterArticles] = React.useState<Article[]>([]);
  const [tracts, setTracts] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Setting Default Values
  React.useEffect(() => {
    queryArticleDataType(
      "ARTICLE_DATA", {
      dateFrom: parseInt(minDate.format("YYYYMMDD")),
      dateTo: parseInt(maxDate.format("YYYYMMDD")),
      area: "all",
    });
    queryTractDataType("TRACT_DATA", { tract: "010103" });

    setTopic("Education");
    setNeighborhood("Fenway");
  }, []);

  React.useEffect(() => {
    console.log("tractData");
    if (tractData) {
      setDemographics(tractData.demographics);
      setArticles(
        getArticlesByKeyWord(topic!, masterArticles, tractData!.tract)
      );
    }
  }, [tractData]);

  React.useEffect(() => {
    const temp: string[] = [];
    const articlesTemp: Article[] = [];
    const countTemp = countArticlesByTract(masterArticles, topic!);

    countTemp.forEach((element) => {
      temp.push(
        getNeighborhood(element[0], neighborhoodMasterList!) +
          " - " +
          element[0] +
          " - " +
          element[1]
      );
    });

    setTracts(temp);
    if (tractData) {
      setArticles(
        getArticlesByKeyWord(topic!, masterArticles, tractData!.tract)
      );
    }
  }, [topic]);

  React.useEffect(() => {
    if (articleData && topic && topicsMasterList) {
      setMasterArticles(articleData!);
      setArticles(articleData!);
      const countTemp = countArticlesByTract(articleData!, topic!);
      const temp: string[] = [];

      countTemp.forEach((element) => {
        temp.push(
          getNeighborhood(element[0], neighborhoodMasterList!) +
            " - " +
            element[0] +
            " - " +
            element[1]
        );
      });

      setTracts(temp);
      setIsLoading(false);
    }
  }, [articleData, topic, topicsMasterList]);

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
            <NeighborhoodDemographicsBoard
              demographics={demographics}
            ></NeighborhoodDemographicsBoard>
          </div>
          <div className="col-md-7 col-sm-12">
            <h1 className="titles">Articles</h1>

            <ArticleCard articles={articles}></ArticleCard>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopicsPage;
