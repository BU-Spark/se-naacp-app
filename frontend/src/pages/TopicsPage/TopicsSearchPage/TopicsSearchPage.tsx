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
      <div className="container-fluid background" style={{ height: "100vh" }}>
        <div className="row justify-content-center align-items-center" >
          <div className="col col-md-6" style={{marginTop: "20vh"}}>
            <div className="text-wrapper">Hi, Boston</div>
          </div>
        </div>

        <div className="row  justify-content-center align-items-center">
          <div className="col col-md-6">
            <p>
              Explore the variations in news coverage across various
              neighborhoods in Boston.
            </p>
          </div>
        </div>

        <div className="row justify-content-center align-items-center">
          <div className="col col-md-6">
            <TopicsSearchBar listOfWords={[]}></TopicsSearchBar>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopicsSearchPage;
