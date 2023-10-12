

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
import { ArticleContext } from "../contexts/article_context";

export default function MainNavigator() {
    const { neighborhoodMasterList, queryArticleDataType } = React.useContext(ArticleContext);

    React.useEffect(() => {
        queryArticleDataType("NEIGHBORHOOD_DATA"); // Bootstrap Initial Lists and States like neighborhood list
    }, [neighborhoodMasterList]);

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