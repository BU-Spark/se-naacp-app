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
import { StateContext } from "../contexts/stateContext";

// Date Context
import { DateContext, DateMethods } from "../contexts/dateContext";

export default function MainNavigator() {
    const { currentState, setState } = React.useContext(StateContext);  // Global Context of States
    const { dates } = React.useContext(DateContext);  // Global Context of Dates

    React.useEffect(() => {
        MasterPipeline.getInitData().then( (v) => {
            console.log("After data fetching, pushing to universal state:", v);
            setState({v});
        })
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