import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Home from "../pages/HomePage/Home";
import DevMode from "../pages/DevelopmentMode/DevMode";
import IntroPage from "../pages/LandingPage/IntroPage";
import SearchByKeyWord from "../pages/SearchByKeyWord/SearchByKeyWord";
import FileUpload from "../pages/UploadArticles/UploadArticles";
import TopNavBar from "../components/TopNavBar/TopNavBar";
import Dashboard from "../pages/DashBoard/MainDashboard/dashboard";
import NeighborhoodDetail from "../pages/DashBoard/NeighborhoodDetail/NeighborhoodDetail"; // Replace with actual path

export default function MainNavigator() {
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
          <Route path="/Dashboard/:neighborhood" element={<NeighborhoodDetail />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
