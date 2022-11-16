import React, { useContext, useState } from "react";
import "./SearchBar.css";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { FilteredContext, FilteredProvider } from "../../context/FilteredContext";

function SearchBar({ word, placeholder, data }) {
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");

  const {setNeighName} = useContext(FilteredContext)

  const handleKeyPress = (event) => {
    if(event.key === 'Enter'){
      setNeighName(wordEntered)
      localStorage.setItem('neighborhoodInput', wordEntered)
      //console.log(localStorage.getItem('neighborhoodInput'))
    }
  }

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    // localStorage.setItem('neighborhoodInput',searchWord)
    // console.log(localStorage.getItem('neighborhoodInput'))
    // const newFilter = data.filter((value) => {
    //   return value.title.toLowerCase().includes(searchWord.toLowerCase());
    // });


    // if (searchWord === "") {
    //   setFilteredData([]);
    // } else {
    //   setFilteredData(newFilter);
    // }
  };

  const clearInput = () => {
    setFilteredData([]);
    setWordEntered("");
  };

  return (
    <div className="search">
    <p className="word">{word}</p>
      <div className="searchInputs">
        <div className="dateIcon">
          {filteredData.length === 0 ? (
            <SearchIcon fontSize="medium"/>
          ) : (
            <CloseIcon id="clearBtn" onClick={clearInput} />
          )}
        </div>
        <input
          type="text"
          placeholder={placeholder}
          value={wordEntered}
          onChange={handleFilter}
          onKeyPress={handleKeyPress}
        />
      </div>
      {filteredData.length != 0 && (
        <div className="dataResult">
          {filteredData.slice(0, 15).map((value, key) => {
            return (
              <a className="dataItem" href={value.link} target="_blank">
                <p>{value.title} </p>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SearchBar;