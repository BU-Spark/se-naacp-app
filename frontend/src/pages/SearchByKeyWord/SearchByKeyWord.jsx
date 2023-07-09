import "./SearchByKeyWord.css";
import React, { useState, useEffect } from "react";
import emptyAstro from '../../assets/lottieFiles/astro_empty.json';
import Lottie from 'react-lottie-player'

import BubbleChart from "../../components/BubbleChart/BubbleChart";
import DataMethods from "../../Pipelines/data";
import { Input, Space } from "antd";
const { Search } = Input;

export default function SearchByKeyWord() {
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState(null);

  const onSearch = async function (value) {
    const bubbleChartData = await DataMethods.getBubbleChartData(value.charAt(0).toUpperCase() + value.slice(1));
    setResult(bubbleChartData);
    setIsLoading(false);
  };

  return (
    <div className="search-container"> 
      <div className="search-wrapper"> 
        <Search
          className="Search"
          placeholder="input a term"
          onSearch={onSearch}
          enterButton
        />
      </div>
      
      {result?.length === 0 ? (
        <React.Fragment>
        <div className="bubble-chart">
            <Lottie loop animationData={emptyAstro} play style={{ width: "100%", height: "auto" }}/> 
            <p className="empty-text">{"No Data out there :("}</p>
        </div>
    </React.Fragment>
      ) : (
        <div className="bubble-chart">
          <BubbleChart data={result}></BubbleChart>
        </div>
      )}
    </div>
  );
}



