//Libaries
import React from "react";
import dayjs from "dayjs";

//Components
import BasicAccordionSmall from "../../../components/AccordionSmall/AccordionSmall";
import TopicsSearchBarLabelOnly from "../../../components/SearchFields/TopicsSearchBarLabelOnly/TopicsSearchBarLabelOnly";

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
    <div className='big-container'>
        <div className='row'>
            <div className='align-self-start org-name'>
                  Explore Topics
            </div>

            <div className="row justify-content-center align-items-center">
                <div className="col alignBar">
                  <TopicsSearchBarLabelOnly listOfWords={[]}></TopicsSearchBarLabelOnly>
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
