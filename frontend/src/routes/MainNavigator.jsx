import React from "react";

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

// Pages
import Home from '../pages/Home'

// Data Fetching
import MasterPipeline from '../Pipelines/masterDataPipeline'

// Universal Context
import { StateContext, stateMethods } from "../contexts/stateContext";

// Date Context
import { DateContext, DateMethods } from "../contexts/dateContext";

// Redux
import { useSelector, useDispatch } from 'react-redux'
import { setNeighborhoodMaster } from '../redux/masterState/masterStateSlice'

export default function MainNavigator() {
    const { currentState, setState } = React.useContext(StateContext);  // Global Context of States

    const { dates } = React.useContext(DateContext);  // Global Context of Dates

    const state = useSelector((state) => state.masterState) // Redux master state
    const dispatch = useDispatch();

    React.useEffect(() => {
        MasterPipeline.getInitData().then( async (v) => {
            console.log("After data fetching, pushing to universal state:", v);
            let newState = stateMethods.updateModified({Subneighborhoods: v[0], Topics: v[1]});
            setState(newState);

            // Using Redux
            try {
                dispatch(setNeighborhoodMaster(v[0]));
            } catch (error) {
                console.log("[Axios Error] Error in retrieving master neighborhood list.")
            }
  
            // console.log("The Universal State after Init Pipeline:", currentState);
        });
    }, []);

    return(
    <>
        <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
        </BrowserRouter>
    </>
    ); 
}