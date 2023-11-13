import React from "react";
import "./IntroPage.css";
import Logo from "../../assets/logos/wgbh-logo.svg";
import { TopicsContext } from "../../contexts/topics_context";
import { NeighborhoodContext } from "../../contexts/neighborhood_context";

const IntroPage = () => {
  
  return (
    <div className="App">
      <header className="App-header">
        <img
          style={{
            marginLeft: 0,
            marginTop: 10,
            marginRight: 0,
            width: 150,
          }}
          src={Logo}
          alt={"Logo"}
        ></img>

        <h1 className="App-title" style={{ marginTop: "20px" }}>
          Welcome To GBH Statistics
        </h1>
      </header>
    </div>
  );
};

export default IntroPage;
