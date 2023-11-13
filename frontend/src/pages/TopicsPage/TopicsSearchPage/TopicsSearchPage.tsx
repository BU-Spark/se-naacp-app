//Libaries
import React from "react";
import dayjs from "dayjs";

//Components
import TopicsSearchBar from "../../../components/SearchFields/TopicsSearchBar/TopicsSearchBar";

//Types

//CSS
import "./TopicsSearchPage.css";
import image from "../../../assets/images/bos.png";

//Contex
import { TopicsContext } from "../../../contexts/topics_context";
import { NeighborhoodContext } from "../../../contexts/neighborhood_context";

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
