import React from "react";

import SearchFields from '../components/SearchFields/SearchFields.js'
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

export default function Home() {
    const { dates } = React.useContext(DateContext);  // Global Context of Dates
    const { currentState, setState } = React.useContext(StateContext);  // Global Context of States
    const { neighborhood } = React.useContext(NeighborhoodContext); // Global Neighborhood
    

    const fetchNeighborhoodAndDateData = async(currentState) => {
        let newState = currentState;
        if (currentState.currentNeigh === "boston_city" || currentState.currentNeigh === undefined || currentState.currentNeigh === "") {
            if (currentState.hasOwnProperty('CensusTract')) {
                delete newState.CensusTract; 
            }
            console.log("Boston City No Data.")
            return newState;
        }
        const data = await DataMethods.getNeighborhoodAndDateData(dates[0], dates[1], currentState.currentNeigh);
        console.log("The Data recieved at Home.jsx", data);
        // If the data is not the same
        if (!stateMethods.equalStateLabel(currentState, "CensusTract", data)) {
            newState = stateMethods.modify(currentState, "CensusTract", data);
        }

        return newState;
    }

    // To Test Dates, use data from: 12/20/2018 up to: 01/20/2019 in roxbury
    React.useEffect( () => {
        // console.log("This is the current universal state BEFORE:", currentState);
        // Invoke Date data fetching when date has been changed
        if (!DateMethods.fromEmpty(dates) && !DateMethods.toEmpty(dates) && DateMethods.dateValidation(dates[0], dates[1])) {
            let newState = fetchNeighborhoodAndDateData(currentState);
            Promise.resolve(newState).then((res) => {
                // Use Effect Updates on reference, not value!
                let newState = stateMethods.updateModified(res);
                setState(newState);
            })
            // console.log("This is the current universal state AFTER:", currentState);
        } else {
            if (currentState.hasOwnProperty('CensusTract')) {
                let newState = currentState
                delete newState.CensusTract; 
                newState = stateMethods.updateModified(newState);
                setState(newState);
            }
        }
    },[dates, neighborhood]);

    return (
        <>
            <div className="home_container">
                <TopNavBar></TopNavBar>
                {/* <Read></Read> */}
                {/* Filter Options */}
                <div className='search_container'>
                    <img style={{marginLeft: 10, marginTop: 10, marginRight: 10, width: 150}} src={Logo} alt={"Logo"}></img>
                    <div style={{flex: 1}}></div>
                    <SearchFields></SearchFields>
                </div>
                <br></br>

                {/* Card UI View */}
                <div className='master_content_container'>
                    <div className='row_left'>
                        <NeighborhoodCard></NeighborhoodCard>
                        <br></br>
                        <div className="graph_card-temp">
                            <NeighborhoodDemoBoard></NeighborhoodDemoBoard>
                        </div>
                        
                    </div>

                    <div className='row_right'>
                        <div className="graph_card">
                            <TrendBoard></TrendBoard>
                        </div>
                        <br></br>
                        <ArticlesCard style={{marginLeft: 20}} topic="Technology"></ArticlesCard>
                    </div>
                </div>
            </div>
        </>
    );
}