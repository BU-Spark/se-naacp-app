// App.js

import React from "react";
import "./IntroPage.css";
import SearchFields from "../../components/SearchFields/SearchFields";

import { Layout, Button } from "antd"; // Ant Design
import { useNavigate } from "react-router-dom";
// import Logo from "../logo.svg"; // GBH Logo
import Logo from "../../wgbh-logo.svg"; // GBH Logo
import { NeighborhoodContext } from '../../contexts/neighborhoodContext.js';




const IntroPage = () => {
  const { neighborhood, setNeigh } = React.useContext(NeighborhoodContext);
  const [showError, setshowerror] = React.useState(false); 
  const navigate = useNavigate();

  const navigateDeveloperMode = () => {
    if(neighborhood === "boston_city"){
      setshowerror(true);
    }else{
      setNeigh("boston_city");
      navigate("/IntroPage");
    }
  };

  const navigateSearchByKeyWord = () => {
      navigate("/SearchByKeyWord");
  };
  return (
    <div className="App">
      <header className="App-header">
        <img
          style={{ marginLeft: 0, marginTop: 10, marginRight: 0, width: 150 }}
          src={Logo}
          alt={"Logo"}
        ></img>

        <h1 className="App-title">Welcome To GBH Statistics</h1>
        <p className="App-intro">
          Choose a neighborhood and a date range to display statistics
        </p>
        <div className="search_container">
          <div style={{ flex: 1 }}></div>
          <SearchFields showDropDown = "true"></SearchFields>
        </div>
        <Button
          id="dev-button"
          onClick={navigateDeveloperMode}
          
        >
          Search Neighborhoods! 
        </Button>
        <Button
          id="dev-button"
          onClick={navigateSearchByKeyWord}
          
        >
          Search By Key! 
        </Button>
        <p style={{display: showError ? "block" : "none"}}>Please select a neighborhood</p>
      </header>
    </div>
  );
};

export default IntroPage;
