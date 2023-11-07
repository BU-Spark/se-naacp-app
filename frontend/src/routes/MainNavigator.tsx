import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import IntroPage from "../pages/LandingPage/IntroPage";
import FileUpload from "../pages/UploadArticles/UploadArticles";
import TopNavBar from "../components/TopNavBar/TopNavBar";
import Dashboard from "../pages/DashboardPage/Dashboard";
import NeighborhoodPage from "../pages/NeighborhoodsPage/NeighborhoodPage"; // Replace with actual path

import { TopicsContext } from "../contexts/topics_context";
import { NeighborhoodContext } from "../contexts/neighborhood_context";
import TopicsPage from "../pages/TopicsPage/TopicsPage";
import TopicsSearchPage from "../pages/TopicsPage/TopicsSearchPage/TopicsSearchPage";

export default function MainNavigator() {
  const {topicsMasterList, queryTopicsDataType} = React.useContext(TopicsContext);
  const {neighborhoodMasterList, queryNeighborhoodDataType} = React.useContext(NeighborhoodContext);

  React.useEffect(() => {
    // Bootstrap Master list data
    queryTopicsDataType("TOPICS_DATA");
    queryNeighborhoodDataType("NEIGHBORHOOD_DATA");
  }, [topicsMasterList, neighborhoodMasterList]);

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
          <Route path="/TopicsSearchPage" element={<TopicsSearchPage />} />

        </Routes>
      </BrowserRouter>
    </>
  );
}
