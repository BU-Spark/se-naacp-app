// App.js

import React from "react";
import "./IntroPage.css";
import SearchFields from "../components/SearchFields/SearchFields";

import { Layout, Button } from "antd"; // Ant Design
import { useNavigate } from "react-router-dom";
// import Logo from "../logo.svg"; // GBH Logo
import Logo from "../wgbh-logo.svg"; // GBH Logo

const IntroPage = () => {
  const navigate = useNavigate();

  const navigateDeveloperMode = () => {
    navigate("/IntroPage");
  };
  return (
    <div className="App">
      <header className="App-header">
        <img
          style={{ marginLeft: 0, marginTop: 10, marginRight: 0, width: 150 }}
          src={Logo}
          alt={"Logo"}
        ></img>

        <h1 className="App-title">Welcome to GBH</h1>

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
      </header>
    </div>
  );
};

export default IntroPage;
