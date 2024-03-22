//Libaries
import React from "react";
import dayjs from "dayjs";

//Components
import TopicsSearchBar from "../../../components/SearchFields/TopicsSearchBar/TopicsSearchBar";
import BubbleChart from "../../../components/BubbleChart/BubbleChart";

//Types

//CSS
import "./TopicsSearchPage.css";
import image from "../../../assets/images/bos.png";

//Contex
import { TopicsContext } from "../../../contexts/topics_context";
import { NeighborhoodContext } from "../../../contexts/neighborhood_context";
import BasicAccordionSmall from "../../../components/AccordionSmall/AccordionSmall";

const TopicsSearchPage: React.FC = () => {
  const { queryNeighborhoodDataType } = React.useContext(NeighborhoodContext);

  React.useEffect(() => {
    queryNeighborhoodDataType("NEIGHBORHOOD_DATA");
  }, []);
  return (
    <>				
    <div className='big-container'>
        <div className='row'>
            <div className='align-self-start org-name'>
                  Explore Topics
            </div>

            <div className="row justify-content-center align-items-center">
                <div className="col alignBar">
                  <TopicsSearchBar listOfWords={[]}></TopicsSearchBar>
                </div>
            </div>

            <div>
                <BasicAccordionSmall></BasicAccordionSmall>
            </div>
        </div>
    </div>
    </>
  );
};

export default TopicsSearchPage;
