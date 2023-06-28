import React from "react";
import { useNavigate } from "react-router-dom";

import SearchFields from '../components/SearchFields/SearchFields'
import ArticlesCard from '../components/ArticleCard/ArticleCard';
import NeighborhoodCard from '../components/Neighborhood/NeighborhoodCard';

import { TopNavBar } from '../components/TopNavBar/TopNavBar';
import  NeighborhoodDemoBoard from '../components/NeighborhoodDemoBoard/NeighborhoodDemoBoard';
import { TrendBoard } from '../components/TrendBoard/TrendBoard';

import Logo from "../logo.svg"; // GBH Logo

// CSS
import './Home.css'

// React Contexts/Context Methods
import { DateContext, DateMethods } from "../contexts/dateContext";
import { StateContext, stateMethods } from '../contexts/stateContext.js';
import { NeighborhoodContext } from '../contexts/neighborhoodContext.js';

// Data Methods 
import DataMethods from '../Pipelines/data';

// Redux
import { useSelector } from 'react-redux'

export default function Home() {
    const { dates } = React.useContext(DateContext);  // Global Context of Dates
    const { currentState, setState } = React.useContext(StateContext);  // Global Context of States
    const { neighborhood } = React.useContext(NeighborhoodContext); // Global Neighborhood
    
    const state = useSelector((state) => state.masterState) // Redux master state
    const state_neigh = useSelector((state) => state.masterState.neighborhoods_master) // Redux master state

    const fetchNeighborhoodAndDateData = async(currentState) => {
        // console.log("heyyyyy",currentState);
        let newState = currentState;
        if (currentState.currentNeigh === "boston_city" || currentState.currentNeigh === undefined || currentState.currentNeigh === "" ||currentState.hasOwnProperty("CurrentTrack") ) {
            const data = await DataMethods.getCensusDateData(dates[0], dates[1], currentState.CurrentTrack);
            console.log("data",data);
            newState = stateMethods.modify(currentState, "CensusTract", data)
            return newState;
        }
        const data = await DataMethods.getgetNeighborhoodAndDateData(dates[0], dates[1], currentState.currentNeigh);
        // console.log("The Data recieved at Home.jsx", data[0]);
        // If the data is not the same
        if (!stateMethods.equalStateLabel(currentState, "CensusTract", data[0])) {
            newState = stateMethods.modify(currentState, "CensusTract", data[0]);
        }

        return newState;
    }
    
    // To Test Dates, use data from: 12/20/2018 up to: 01/20/2019 in roxbury
    React.useEffect( () => {
        // console.log("whats up",dates,neighborhood)
        // console.log("This is the current universal state BEFORE:", currentState);
        // Invoke Date data fetching when date has been changed
        if (!DateMethods.fromEmpty(dates) && !DateMethods.toEmpty(dates) && DateMethods.dateValidation(dates[0], dates[1])) {
            let newState = fetchNeighborhoodAndDateData(currentState);
            Promise.resolve(newState).then((res) => {
                // Use Effect Updates on reference, not value!
                let newState = stateMethods.updateModified(res);
                setState(newState);
            })
        } else {
            if (currentState.hasOwnProperty('CensusTract')) {
                let newState = currentState
                delete newState.CensusTract; 
                newState = stateMethods.updateModified(newState);
                setState(newState);
            }
        }
    },[dates, neighborhood]);


    const navigate = useNavigate();

    const handleButtonClick = () => {
      navigate("/");
    };


    return (
        <>
            <div className="home_container">
                <TopNavBar></TopNavBar>

                {/* Filter Options */}
                <div className='search_container'>
                    <img onClick = { handleButtonClick}style={{marginLeft: 50, marginTop: 10, marginRight: 10, width: 150}} src={Logo} alt={"Logo"}></img>
                    <div style={{flex: 1}}></div>
                    <SearchFields showDropDown = "false"></SearchFields>
                </div>
                <br></br>

                {/* Card UI View */}
                <div className='master_content_container'>

                    {/* 2nd Data Cards */}
                    {/* <div className="data-cards">
                        <div className="graph_card">
                            <NeighborhoodCensus></NeighborhoodCensus>
                        </div>
                    </div> */}

                    {/* Map Card */}
                    <div className="neighborhood-container">
                        <NeighborhoodCard></NeighborhoodCard>
                    </div>

                    {/* 1st Data Cards */}
                    <div className="data-cards">
                        <div className="graph_card">
                            <NeighborhoodDemoBoard></NeighborhoodDemoBoard>
                        </div>
                        <div className="graph_card">
                            <TrendBoard></TrendBoard>
                        </div>
                    </div>

                     {/* Article Card */}
                    <div className="article-container">
                        <ArticlesCard style={{marginLeft: 20}} topic="Technology"></ArticlesCard>
                    </div>
                    
                </div>
            </div>
        </>
    );
}