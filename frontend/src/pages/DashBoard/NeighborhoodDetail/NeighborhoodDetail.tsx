import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArticleCard from "../../../components/ArticleCard/ArticleCard";
import FrequencyBarChart from "../../../components/FrequencyBarChart/FrequencyBarChart";
import NeighborhoodDemographicsBoard from "../../../components/NeighborhoodDemoBoard/NeighborhoodDemoBoard";

import { Article, Demographics } from "../../../__generated__/graphql";
import "./NeighborhoodDetail.css";
import "font-awesome/css/font-awesome.min.css";
import TractsDropDown from "../../../components/TractsDropDown/TractsDropDown";
import MapCard from "../../../components/MapCard/MapCard";
const NeighborhoodDetail: React.FC = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const demographics: Demographics = {
    p2_001n: "5722",
    p2_002n: "1843",
    p2_003n: "3879",
    p2_004n: "3559",
    p2_005n: "151",
    p2_006n: "3209",
    p2_007n: "18",
    p2_008n: "64",
    p2_009n: "0",
    p2_010n: "117",
  };

  const article: Article = {
    neighborhoods: ["Fenway"],
    position_section: "Education",
    tracts: ["010300"],
    author: "Esteban Bustillos",
    body: "Thomas White, a senior at Boston Latin School...",
    content_id: "00000175-7583-d779-a575-779f0f6b0001",
    hl1: "For High School Athletes, The Pandemic Has Led To Uncertainty, Anxiety",
    hl2: "For High School Athletes, The Pandemic Has Led To Uncertainty, Anxiety",
    pub_date: "2020-11-11 00:00:00",
    pub_name: "GBH",
    link: "https://wgbh.org/news/education/2020/11/11/for-high-school-athletes-the-pandemic-has-led-to-uncertainty-anxiety",
    openai_labels: [],
    dateSum: 20201111,
  };
  const articles: Article[] = [];

  const authors = ["Author1", "Author2", "Author3"];
  const labels = [
    "COVID",
    "Education",
    "Sports",
    "Health",
    "Anxiety",
    "Hello",
    "Its me",
    "Never mind",
  ]; // Predefined set of labels

  const neighborhoods = [
    ["Fenway"],
    ["Backbay"],
    ["Allston"],
    ["Roxbury"],
    ["Seaport"],
    ["Seaport"],
    ["Dorchester"],
    ["Beacon Hill"],
  ]; // Predefined set of labels

  for (let i = 0; i < 100; i++) {
    const newArticle = { ...article };
    newArticle.author = authors[i % authors.length];
    newArticle.content_id = `00000175-7583-d779-a575-779f0f6b00${i
      .toString()
      .padStart(2, "0")}`;
    newArticle.pub_date = "2020-11-11 00:00:00";
    newArticle.dateSum = 20201111;

    // Randomly assigning a label to the openai_labels array
    const randomLabel = labels[Math.floor(Math.random() * labels.length)];
    newArticle.openai_labels = [randomLabel];

    const randomNei =
      neighborhoods[Math.floor(Math.random() * neighborhoods.length)];
    newArticle.neighborhoods = randomNei;

    articles.push(newArticle);
  }

  const tracts = [
    "092400",
    "091400",
    "090300",
    "091800",
    "092300",
    "100601",
    "090901",
    "100400",
    "090100",
    "091001",
    "090200",
    "100200",
    "091700",
    "092200",
    "090700",
    "091500",
    "091300",
    "100300",
    "100100",
    "092000",
    "100500",
    "100800",
    "100603",
    "091200",
    "100700",
    "092101",
    "091900",
    "091600",
    "091100",
  ];
  const handleBoxClick = () => {
    navigate("../Dashboard"); // Navigate to the new route
  };

  const { neighborhood } = useParams<{ neighborhood: string }>();

  console.log(neighborhood);
  return (
    <>
      <div className="big-container">
        <div className="row">
          <div className="col">
            {/* <div onClick={handleBoxClick}></div> */}

            <p className="week" onClick={() => handleBoxClick()}>
              <i
                className="fa fa-arrow-left"
                aria-hidden="true"
                style={{ marginRight: "10px" }}
              ></i>

              <span className="text-wrapper">Back to </span>
              <span className="span">Dashboard </span>
            </p>
            <div className="align-self-start your-org">
              SELECTED NEIGHBORHOOD
            </div>
            <div className="align-self-start org-name">{neighborhood}</div>
            <h1></h1>
          </div>
        </div>

        <div className="row justify-content-evenly">
          <div className="col-md-3 col-sm-12">
            <h1 className="titles">Tracts</h1>
            <TractsDropDown tracts={tracts}></TractsDropDown>
          </div>
          <div className="col-md-5 col-sm-12">
            <h1 className="titles">Map</h1>
            <MapCard ></MapCard>
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
              openAI={true}
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

export default NeighborhoodDetail;
