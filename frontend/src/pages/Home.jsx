import React from "react";

import SearchFields from '../components/SearchFields/SearchFields.js'
import ArticlesCard from '../components/ArticleCard/ArticleCard';
import NeighborhoodCard from '../components/Neighborhood/NeighborhoodCard';
import { TopNavBar } from '../components/TopNavBar/TopNavBar';
import { NeighborhoodDemoBoard } from '../components/NeighborhoodDemoBoard/NeighborhoodDemoBoard';
import { TrendBoard } from '../components/TrendBoard/TrendBoard';
import Read from '../components/DataRetrieve/data';
import Logo from "../logo.svg";

// CSS
import './Home.css'

export default function Home() {

    return (
        <>
            <div className="home_container">
                <TopNavBar></TopNavBar>
                <Read></Read>
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
                        <NeighborhoodDemoBoard></NeighborhoodDemoBoard>
                    </div>

                    <div className='row_right'>
                        <TrendBoard></TrendBoard>
                        <br></br>
                        <ArticlesCard style={{marginLeft: 20}} topic="Technology"></ArticlesCard>
                    </div>
                </div>
            </div>
        </>
    );
}