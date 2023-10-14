import React from "react";
import dayjs, { Dayjs } from "dayjs";

import NeighborhoodDemographicsBoard from "../../components/NeighborhoodDemoBoard/NeighborhoodDemoBoard";
import { Demographics, Article } from "../../__generated__/graphql";
import ArticleCard from "../../components/ArticleCard/ArticleCard";
import FrequencyBarChart from "../../components/FrequencyBarChart/FrequencyBarChart";
import SearchBarDropDown from "../../components/SearchFields/SearchBarDropdown/SearchBarDropdown";

import SearchFields from "../../components/SearchFields/SearchFields";

export default function DevMode() {
  const myDemographics: Demographics = {
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

  for (let i = 0; i < 100; i++) {
    const newArticle = { ...article };
    newArticle.author = authors[i % authors.length];
    newArticle.content_id = `00000175-7583-d779-a575-779f0f6b00${i
      .toString()
      .padStart(2, "0")}`;
    newArticle.pub_date = `2020-11-${(11 + i)
      .toString()
      .padStart(2, "0")} 00:00:00`;
    newArticle.dateSum = 20201111 + i;

    // Randomly assigning a label to the openai_labels array
    const randomLabel = labels[Math.floor(Math.random() * labels.length)];
    newArticle.openai_labels = [randomLabel];

    articles.push(newArticle);
  }

  console.log(articles);

  console.log("im here:", articles);

  return (
    <>
      <NeighborhoodDemographicsBoard demographics={myDemographics} />{" "}
      <ArticleCard articles={articles}></ArticleCard>
      <FrequencyBarChart
        articles={articles}
        num={7}
        openAI={true}
      ></FrequencyBarChart>
      <SearchBarDropDown
        listOfWords={["Fenway", "Backbay", "Allston"]}
        title="Neighborhoods"
      ></SearchBarDropDown>
      <SearchFields
        minDate={dayjs("01/01/2020")}
        maxDate={dayjs("01/01/2024")}
        listOfWords={["Fenway", "Backbay", "Allston"]}
        showDropDown={true}
      ></SearchFields>
    </>
  );
}
