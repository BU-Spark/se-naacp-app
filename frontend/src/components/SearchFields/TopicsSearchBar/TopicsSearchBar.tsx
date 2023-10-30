import "./TopicsSearchBar.css";

import { Input, Switch, AutoComplete } from "antd";
import { AnyAaaaRecord } from "dns";
import { useContext, useEffect, useState } from "react";
import { TopicsContext } from "../../../contexts/topics_context";
const { Search } = Input;

interface SearchBarDropDownPros {
  listOfWords: string[];
}

const TopicsSearchBar: React.FC<SearchBarDropDownPros> = ({ listOfWords }) => {
  const { topicsMasterList, queryTopicsDataType, setTopic, topic } =
    useContext(TopicsContext)!;
  const [result, setResult] = useState(null);
  const [options, setOptions] = useState(listOfWords); // Autocomplete options
  const [givenWords, setGivenWords] = useState(listOfWords); // Words from getKeywords
  const [isOpenAI, setIsOpenAI] = useState(false);
  //   useEffect(() => {
  //     getKeywords();
  //   }, [isOpenAI]);

  const onChange = (checked: any) => {
    setIsOpenAI(!checked);
    setResult(null);
  };

  //   const getKeywords = async () => {
  //     const keywords = await DataMethods.getKeywords(isOpenAI);
  //     setGivenWords(keywords);
  //     setOptions(keywords);
  //   };

  const onSearch = async function (value: any) {
    // const bubbleChartData = await DataMethods.getBubbleChartData(
    //   value.charAt(0).toUpperCase() + value.slice(1),
    //   isOpenAI
    // );
    // setResult(bubbleChartData);
    setTopic(value);
  };

  const handleSearch = (value: any) => {
    if (value.trim() === "") {
      return; // Ignore empty search queries
    }
    onSearch(value);
  };

  const onSelect = (value: any) => {
    onSearch(value);
  };

  const handleInputChange = (value: any) => {
    const matchedOptions = givenWords.filter((word) =>
      word.toLowerCase().includes(value.toLowerCase())
    );
    setOptions(matchedOptions);
  };

  return (
    <>
      {/* <div className="search-wrapper"> */}
      <AutoComplete
        className="Search"
        options={options.map((option) => ({ value: option }))}
        onSelect={onSelect}
        onSearch={handleInputChange}
      >
        <Search
          style={{ width: "100%" }}
          placeholder="input a term"
          enterButton
          onSearch={handleSearch}
        />
      </AutoComplete>
      {/* <div className="switch-container">
          <span className="switch-label">AI Labels</span>
          <Switch defaultChecked onChange={onChange} />
          <span className="switch-label">OpenAI Labels On</span>
        </div> */}
      {/* </div> */}
    </>
  );
};

export default TopicsSearchBar;
