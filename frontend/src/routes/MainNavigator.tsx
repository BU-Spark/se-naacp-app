import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Home from "../pages/HomePage/Home";
import DevMode from "../pages/DevelopmentMode/DevMode";
import IntroPage from "../pages/LandingPage/IntroPage";
import SearchByKeyWord from "../pages/SearchByKeyWord/SearchByKeyWord";
import FileUpload from "../pages/UploadArticles/UploadArticles";
import TopNavBar from "../components/TopNavBar/TopNavBar";
import Dashboard from "../pages/DashboardPage/Dashboard";
import NeighborhoodPage from "../pages/NeighborhoodsPage/NeighborhoodPage"; // Replace with actual path

import { ArticleContext } from "../contexts/article_context";
import { TopicsContext } from "../contexts/topics_context";
import { NeighborhoodContext } from "../contexts/neighborhood_context";
import { TractContext } from "../contexts/tract_context";
import dayjs from "dayjs";

export default function MainNavigator() {
  const {
    setNeighborhood,
    neighborhood,
    neighborhoodMasterList,
    queryNeighborhoodDataType,
  } = React.useContext(NeighborhoodContext)!;

  const { tractData, queryTractDataType } = React.useContext(TractContext)!;

  const { articleData, queryArticleDataType } =
    React.useContext(ArticleContext)!;

  const minDate = dayjs("2020-11-01");
  const maxDate = dayjs("2023-01-09");

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

  // console.log(tractData!.tract);

  return (
    <>
      <BrowserRouter>
        <TopNavBar></TopNavBar>
        <Routes>
          <Route path="/IntroPage" element={<Home />} />
          <Route path="/dev-mode" element={<DevMode />} />
          <Route path="/" element={<IntroPage />} />
          <Route path="/SearchByKeyWord" element={<SearchByKeyWord />} />
          <Route path="/UploadArticles" element={<FileUpload />} />
          <Route path="/Dashboard" element={<Dashboard />}></Route>
          <Route path="/Neighborhoods" element={<NeighborhoodPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
