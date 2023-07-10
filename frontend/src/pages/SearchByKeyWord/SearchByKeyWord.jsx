import "./SearchByKeyWord.css";
import React, { useState, useEffect } from "react";
import emptyAstro from "../../assets/lottieFiles/astro_empty.json";
import Lottie from "react-lottie-player";
import BubbleChart from "../../components/BubbleChart/BubbleChart";
import DataMethods from "../../Pipelines/data";
import { Input, Space, AutoComplete } from "antd";
const { Search } = Input;

export default function SearchByKeyWord() {
  const [result, setResult] = useState(null);
  const [options, setOptions] = useState([]); // Autocomplete options
  const [givenWords, setGivenWords] = useState([]); // Words from getKeywords

  useEffect(() => {
    getKeywords();
  }, []);

  const getKeywords = async () => {
    const keywords = await DataMethods.getKeywords();
    setGivenWords(keywords);
  };

  const onSearch = async function (value) {
    const bubbleChartData = await DataMethods.getBubbleChartData(
      value.charAt(0).toUpperCase() + value.slice(1)
    );
    setResult(bubbleChartData);
  };

  const handleSearch = (value) => {
    if (value.trim() === "") {
      return; // Ignore empty search queries
    }
    onSearch(value);
  };

  const onSelect = (value) => {
    onSearch(value);
  };

  const handleInputChange = (value) => {
    const matchedOptions = givenWords.filter((word) =>
      word.toLowerCase().includes(value.toLowerCase())
    );
    setOptions(matchedOptions);
  };

  return (
    <div className="search-container">
      <div className="search-wrapper">
        <AutoComplete
          className="Search"
          options={options.map((option) => ({ value: option }))}
          onSelect={onSelect}
          onSearch={handleInputChange}
        >
          <Search
            placeholder="input a term"
            enterButton
            onSearch={handleSearch}
          />
        </AutoComplete>
      </div>

      {result?.length === 0 ? (
        <React.Fragment>
          <div className="bubble-chart">
            <Lottie
              loop
              animationData={emptyAstro}
              play
              style={{ width: "100%", height: "auto" }}
            />
            <p className="empty-text">{"No Data out there :("}</p>
          </div>
        </React.Fragment>
      ) : (
        <div className="bubble-chart">
          <BubbleChart data={result}></BubbleChart>
          <p className="bubble-message">***If the bubble is empty click on it to show text. We hide the text if it is too large for the bubble***</p>
        </div>
      )}
    </div>
  );
}
