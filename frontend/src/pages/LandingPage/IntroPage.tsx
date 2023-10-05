import React from "react";
import SearchFields from "../../components/SearchFields/SearchFields";
import "./IntroPage.css";

import { Button } from "antd"; // Ant Design
import { useNavigate, NavigateFunction } from "react-router-dom";

import Logo from "../../assets/logos/wgbh-logo.svg";
import { NeighborhoodContext2 } from "../../contexts/neighborhoodContext.js";

const IntroPage = () => {
  const { neighborhood, setNeigh } = React.useContext(NeighborhoodContext2);
  const [showError, setshowerror] = React.useState<boolean>(false); // Enforce typing here
  const navigate: NavigateFunction = useNavigate(); // Enforce typing here

  const navigateDeveloperMode = () => {
    if (neighborhood === "boston_city") {
      setshowerror(true);
    } else {
      setNeigh("boston_city");
      navigate("/IntroPage");
    }
  };
  
  const navigateSearchByKeyWord = () => {
    navigate("/SearchByKeyWord");
  };

  const navigateUploadPage = () => {
    navigate("/UploadArticles");
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
          <SearchFields showDropDown="true"></SearchFields>
        </div>
        <Button id="dev-button" onClick={navigateDeveloperMode}>
          Search Neighborhoods!
        </Button>
        <Button
          style={{ marginLeft: "10px" }}
          id="dev-button"
          onClick={navigateSearchByKeyWord}
        >
          Search By Keywords!
        </Button>
        <Button
          style={{ marginLeft: "10px" }}
          id="dev-button"
          onClick={navigateUploadPage}
        >
          Upload Articles!
        </Button>
        <p style={{ display: showError ? "block" : "none" }}>
          Please select a neighborhood
        </p>
      </header>
    </div>
  );
};

export default IntroPage;