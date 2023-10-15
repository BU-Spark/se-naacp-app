import "./dashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import dayjs, { Dayjs } from "dayjs";

import NeighborhoodDemographicsBoard from "../../components/NeighborhoodDemoBoard/NeighborhoodDemoBoard";
import { Demographics, Article } from "../../__generated__/graphql";
import ArticleCard from "../../components/ArticleCard/ArticleCard";
import FrequencyBarChart from "../../components/FrequencyBarChart/FrequencyBarChart";
import SearchBarDropDown from "../../components/SearchFields/SearchBarDropdown/SearchBarDropdown";
import TopNavBar from "../../components/TopNavBar/TopNavBar";
import SearchFields from "../../components/SearchFields/SearchFields";
import AtGlance from "../../components/AtGlance/atGlance";
import TopNeighborhoods from "../../components/TopNeighborhoods/TopNeighborhoods";
export default function Dashboard() {
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

  const neighborhood = [
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
      neighborhood[Math.floor(Math.random() * neighborhood.length)];
    newArticle.neighborhoods = randomNei;

    articles.push(newArticle);
  }

  return (
    <>
      <div className="big-container">
        <div className="row">
          <div className="col">
            <div className="align-self-start your-org">YOUR ORGANIZATION</div>
            <div className="align-self-start org-name">
              WGBH Educational Foundation
            </div>
            <p className="week">
              <span className="text-wrapper">Week </span>
              <span className="span">9/26/23 - 10/3/23</span>
            </p>
          </div>
        </div>

        <div className="row justify-content-evenly">
          <div className="col-md-4 col-sm-12">
            <AtGlance articles={articles}></AtGlance>
          </div>
          <div className="col-md-8 col-sm-12">
            <TopNeighborhoods articles={articles}></TopNeighborhoods>
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
}
