//Libaries
import React from "react";
import dayjs from "dayjs";

import image from "../../../assets/images/bos.png";

//Components

//Types

//CSS
import "./TopicsSearchPage.css";
import TopicsSearchBar from "../../../components/SearchFields/TopicsSearchBar/TopicsSearchBar";
import "bootstrap/dist/css/bootstrap.css";
import { TopicsContext } from "../../../contexts/topics_context";
import { NeighborhoodContext } from "../../../contexts/neighborhood_context";
// import "font-awesome/css/font-awesome.min.css";

//Contex

const TopicsSearchPage: React.FC = () => {
  const { queryNeighborhoodDataType } = React.useContext(NeighborhoodContext);

  React.useEffect(() => {
    queryNeighborhoodDataType("NEIGHBORHOOD_DATA");
  }, []);
  return (
    <>
      <div className="container background" style={{ maxWidth: "100%" }}>
        <div className="row align-items-start">
          <div className="text-wrapper">Hi, Boston</div>
        </div>
        <div className="row align-items-center">
          <p>
            Explore the variations in news coverage across various neighborhoods
            in Boston.
          </p>
        </div>
        <div className="row align-items-end">
          <TopicsSearchBar listOfWords={[]}></TopicsSearchBar>
        </div>
      </div>
    </>
  );
};

export default TopicsSearchPage;
