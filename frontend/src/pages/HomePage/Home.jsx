import React from "react";
import { useNavigate } from "react-router-dom";
import Lottie from 'react-lottie-player'

import './Home.css' // CSS

import Logo from "../../assets/logos/logo.svg"; // GBH Logo
import TopNavBar from '../../components/TopNavBar/TopNavBar';

import SearchFields from '../../components/SearchFields/SearchFields'
import ArticlesCard from '../../components/ArticleCard/ArticleCard';
import NeighborhoodCard from '../../components/Neighborhood/NeighborhoodCard';
import  NeighborhoodDemoBoard from '../../components/NeighborhoodDemoBoard/NeighborhoodDemoBoard';
import { TrendBoard } from '../../components/TrendBoard/TrendBoard';
import { FrequencyBarChart } from '../../components/FrequencyBarChart/FrequencyBarChart'

// React Contexts/Context Methods
import { DateContext, DateMethods } from "../../contexts/dateContext";
import { StateContext, stateMethods } from '../../contexts/stateContext.js';
import { NeighborhoodContext2 } from '../../contexts/neighborhoodContext.js';

// Data Methods 
import DataMethods from '../../Pipelines/data';

// Assets
import graphLoading from '../../assets/lottieFiles/spinner.json';

// Redux
import { useSelector } from 'react-redux'

export default function Home() {
    const { dates } = React.useContext(DateContext);  // Global Context of Dates
    const { currentState, setState } = React.useContext(StateContext);  // Global Context of States
    const { neighborhood } = React.useContext(NeighborhoodContext2); // Global Neighborhood
    
    const state = useSelector((state) => state.masterState) // Redux master state
    const state_neigh = useSelector((state) => state.masterState.neighborhoods_master) // Redux master state
    const loadingState = useSelector((state) => state.masterState.universal_loading_state.payload); // Redux loading state

    const [loadingGraph, setLoadingGraph] = React.useState(false);
    const [loadingTimeout, setLoadingTimeout] = React.useState(undefined);

    const fetchNeighborhoodAndDateData = async(currentState) => {
        const datatesing = await DataMethods.getBubbleChartData("Education");
        console.log(datatesing);
        let newState = currentState;
        if (currentState.currentNeigh === "boston_city" || currentState.currentNeigh === undefined || currentState.currentNeigh === "" ||currentState.hasOwnProperty("CurrentTrack") ) {
            const data = await DataMethods.getCensusDateData(dates[0], dates[1], currentState.CurrentTrack);
            console.log("data",data);
            newState = stateMethods.modify(currentState, "CensusTract", data)
            return newState;
        }
        const data = await DataMethods.getgetNeighborhoodAndDateData(dates[0], dates[1], currentState.currentNeigh);
        // If the data is not the same
        if (!stateMethods.equalStateLabel(currentState, "CensusTract", data[0])) {
            newState = stateMethods.modify(currentState, "CensusTract", data[0]);
        }

        return newState;
    }
    
    React.useEffect( () => {
        // Invoke Date data fetching when date has been changed
        if (!DateMethods.fromEmpty(dates) && !DateMethods.toEmpty(dates) && DateMethods.dateValidation(dates[0], dates[1])) {
            let newState = fetchNeighborhoodAndDateData(currentState);
            Promise.resolve(newState).then((res) => {
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

        // Handle overall loading logic
        // if (loadingState) {
        //     setLoadingTimeout(setTimeout(() => {
        //         if (loadingState) {
        //             console.log("Loading was not completed before two seconds!")
        //             console.log("Switch on loading!");
        //         }
        //     }, 5000)); 
        // } else {
        //     console.log("TIMER:", loadingTimeout)
        //     if (loadingTimeout !== undefined) {
        //         console.log("Clearing timeout")
        //         clearTimeout(loadingTimeout)
        //     }
        //     console.log("Dont switch on loading!");
        // }

        if (loadingState) {
            setLoadingGraph(true)
            console.log("Loading!")
        } else {
            setLoadingGraph(false)
            console.log("Not loading!")
        }
    },[dates, neighborhood, loadingState]);


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

                    {/* Map Card */}
                    <div className="neighborhood-container">
                        <NeighborhoodCard></NeighborhoodCard>
                    </div>

                    {loadingGraph ? 
                        <div style={{
                            display: "flex", 
                            justifyContent: "center",
                            }}>
                            <Lottie loop animationData={graphLoading} play style={{ width: "50%", height: "auto" }}/> 
                        </div>
                    :
                        <div>
                            {/* 1st Data Cards */}
                            <div className="data-cards">
                                <div className="graph_card">
                                    <NeighborhoodDemoBoard></NeighborhoodDemoBoard>
                                </div>
                                <div className="graph_card">
                                    <TrendBoard></TrendBoard>
                                </div>
                            </div>

                            {/* 2nd Data Cards */}
                            <div className="data-cards">
                                <div className="graph_card_long">
                                    <FrequencyBarChart></FrequencyBarChart>
                                </div>
                            </div>
                        
                            {/* Article Card */}
                            <div className="article-container">
                                <ArticlesCard style={{marginLeft: 20}} topic="Technology"></ArticlesCard>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </>
    );
}