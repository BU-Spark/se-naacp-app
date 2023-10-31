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
import TopicsPage from "../pages/TopicsPage/TopicsPage";

export default function MainNavigator() {
  

  // console.log(topic);

  return (
    <>
      <BrowserRouter>
        <TopNavBar></TopNavBar>
        <Routes>
          <Route path="/" element={<IntroPage />} />
          <Route path="/Topics" element={<TopicsPage />} />
          <Route path="/UploadArticles" element={<FileUpload />} />
          <Route path="/Dashboard" element={<Dashboard />}></Route>
          <Route path="/Neighborhoods" element={<NeighborhoodPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
