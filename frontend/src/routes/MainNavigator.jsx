

import React from "react";
import {useState} from 'react'
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
import client from "../Pipelines/apolloClient"

// Data Fetching
import MasterPipeline from '../Pipelines/masterDataPipeline'

// Universal Context
import { StateContext, stateMethods } from "../contexts/stateContext";

// Redux
import { useSelector, useDispatch } from 'react-redux'
import initThunkMethods from "../Pipelines/initPipeline";

// Context
import { TractContext } from "../contexts/tract_context"
import { gql } from '@apollo/client';

export default function MainNavigator() {
    const { setState } = React.useContext(StateContext);  // Global Context of States

    const { tractData, fetchData } = React.useContext(TractContext);

    //const state = useSelector((state) => state.masterState) // Redux master state
    const dispatch = useDispatch();
    const [data, setData] = useState([]);

    React.useEffect(() => {
        fetchData({"neighborhood": "Downtown"})
        console.log("FETCHED DATA:", tractData);

        // Redux way below
        // dispatch(initThunkMethods.bootstrapClientDataStruct());
        
        MasterPipeline.rootPathInitData().then( async (v) => {
            let newState = stateMethods.updateModified({Subneighborhoods: v[0], Topics: v[1]});
            setState(newState);
            setData([v[2],v[3]]);
        });
    }, [dispatch, tractData]);

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