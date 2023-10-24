

import React from "react";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

// Pages
import Home from '../pages/HomePage/Home'
import DevMode from "../pages/DevelopmentMode/DevMode";
import IntroPage from "../pages/LandingPage/IntroPage";
import SearchByKeyWord from "../pages/SearchByKeyWord/SearchByKeyWord"
import FileUpload from "../pages/UploadArticles/UploadArticles"

// Context
import { TopicsContext } from "../contexts/topics_context";
import { NeighborhoodContext } from "../contexts/neighborhood_context";

export default function MainNavigator() {
    const { topicsMasterList, queryTopicsDataType } = React.useContext(TopicsContext);
    const { neighborhoodMasterList, queryNeighborhoodDataType } = React.useContext(NeighborhoodContext);

    React.useEffect(() => {
        queryTopicsDataType("TOPICS_DATA");
        queryNeighborhoodDataType("NEIGHBORHOOD_DATA");
    }, [neighborhoodMasterList, topicsMasterList]);

    return(
    <>
        <BrowserRouter>
                <Routes>
                    <Route path="/IntroPage" element={<Home />} />
                    <Route path="/dev-mode" element={<DevMode />} />
                    <Route path="/" element={<IntroPage />} />
                    <Route path="/SearchByKeyWord" element={<SearchByKeyWord />} />
                    <Route path="/UploadArticles" element={<FileUpload />} />
                </Routes>
        </BrowserRouter>
    </>
    ); 
}