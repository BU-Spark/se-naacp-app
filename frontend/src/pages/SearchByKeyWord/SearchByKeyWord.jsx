import "./SearchByKeyWord.css";
import React, { useState, useEffect } from "react";
import BubbleChart from "../../components/BubbleChart/BubbleChart";
import DataMethods from "../../Pipelines/data";
import { Input, Space } from "antd";
const { Search } = Input;

export default function SearchByKeyWord() {
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState(null);

  const onSearch = async function (value) {
    const bubbleChartData = await DataMethods.getBubbleChartData(value);
    setResult(bubbleChartData);
    setIsLoading(false);
  };

  return (
    <div className="search-container"> 
      <div className="search-wrapper"> 
        <Search
          className="Search"
          placeholder="input search text"
          onSearch={onSearch}
          enterButton
        />
      </div>
      
      {isLoading ? (
        <p></p>
      ) : (
        <div className="bubble-chart">
          <BubbleChart data={result}></BubbleChart>
        </div>
      )}
    </div>
  );
}



